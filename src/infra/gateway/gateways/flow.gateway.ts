import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { DefaultEventsMap, Socket } from 'socket.io';

import { z } from 'zod';

import { FlowInput } from 'src/core/schemas/data.schema';
import { YamlSchema } from 'src/core/schemas/flow.schema';
import { GetFlowSchemaUseCase } from 'src/domain/use-cases/flowSchema/get-flow-schema.use-case';
import { CreateFlowUseCase } from 'src/domain/use-cases/flow/create-flow.use-case';

import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { SetFlowInputUseCase } from 'src/domain/use-cases/flowSchema/set-flow-input.use-case';

const getFlowSchemaBodySchema = z.object({
  flowSchemaId: z.string().uuid(),
});

export const setFlowFieldSchema = z.object({
  path: z.string(),
  value: z.unknown(),
});

export type SetFlowField = z.infer<typeof setFlowFieldSchema>;

export const setFlowFieldsListSchema = z.array(setFlowFieldSchema);
export type SetFlowFieldsList = z.infer<typeof setFlowFieldsListSchema>;

type SocketData = {
  schema: YamlSchema;
  inputs?: FlowInput;
};

type FlowSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

type GetFlowSchemaBodySchema = z.infer<typeof getFlowSchemaBodySchema>;

@WebSocketGateway()
export class FlowGateway {
  constructor(
    private readonly createFlowUseCase: CreateFlowUseCase,
    private readonly getFlowSchemaUseCase: GetFlowSchemaUseCase,
    private readonly setFlowInput: SetFlowInputUseCase,
  ) {}

  @SubscribeMessage('get-flow-schema')
  async getFlowSchema(
    @MessageBody(new ZodValidationPipe(getFlowSchemaBodySchema))
    body: GetFlowSchemaBodySchema,
    @ConnectedSocket()
    client: FlowSocket,
  ) {
    const { schema } = await this.getFlowSchemaUseCase.execute({
      flowSchemaId: body.flowSchemaId,
    });

    client.data.schema = schema;
    client.data.inputs = { groups: {} };

    return client.emit('get-flow-schema', schema);
  }

  @SubscribeMessage('set-field-data')
  async setFieldData(
    @MessageBody(new ZodValidationPipe(setFlowFieldSchema))
    body: SetFlowField,
    @ConnectedSocket() client: FlowSocket,
  ) {
    if (!client.data.inputs) {
      throw new WsException('Load the flow schema first');
    }

    const { inputs } = await this.setFlowInput.execute({
      inputs: client.data.inputs,
      path: body.path,
      schema: client.data.schema,
      value: body.value,
    });

    client.data.inputs = inputs;

    return client.emit('set-field-data', { inputs });
  }

  @SubscribeMessage('create-flow')
  createFlow(@ConnectedSocket() client: FlowSocket) {
    const { flow } = this.createFlowUseCase.execute({
      inputs: client.data.inputs,
    });

    return client.emit('create-flow', { flow });
  }

  @SubscribeMessage('download-flow')
  downloadFlow(@ConnectedSocket() client: FlowSocket) {}
}
