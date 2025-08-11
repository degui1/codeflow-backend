import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { promises } from 'node:fs';
import { DefaultEventsMap, Socket } from 'socket.io';
import { z } from 'zod';

import { FlowInput } from 'src/core/schemas/data.schema';
import { YamlSchema } from 'src/core/schemas/flow.schema';
import { GetFlowSchemaUseCase } from 'src/domain/use-cases/flow/get-flow-schema.use-case';
import { CreateFlowUseCase } from 'src/domain/use-cases/flow/create-flow.use-case';
import { CreateFlowFileUseCase } from 'src/domain/use-cases/flow/create-flow-file.use-case';
import { SetFlowInputUseCase } from 'src/domain/use-cases/flow/set-flow-input.use-case';
import { EnvService } from 'src/infra/env/env.service';

import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

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
  flow?: string;
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
    private readonly envService: EnvService,
    private readonly createFlowUseCase: CreateFlowUseCase,
    private readonly getFlowSchemaUseCase: GetFlowSchemaUseCase,
    private readonly setFlowInput: SetFlowInputUseCase,
    private readonly createFlowFile: CreateFlowFileUseCase,
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
  async createFlow(@ConnectedSocket() client: FlowSocket) {
    const { flow } = await this.createFlowUseCase.execute({
      inputs: client.data.inputs,
      rules: client.data.schema.rules,
    });

    client.data.flow = flow;

    return client.emit('create-flow', { flow });
  }

  @SubscribeMessage('download-flow')
  async downloadFlow(@ConnectedSocket() client: FlowSocket) {
    if (!client.data.flow) {
      throw new WsException('The flow was not previously created');
    }

    const { path } = this.createFlowFile.execute({ flow: client.data.flow });

    const fileBuffer = await promises.readFile(path);

    return client.emit('download-flow', fileBuffer);
  }
}
