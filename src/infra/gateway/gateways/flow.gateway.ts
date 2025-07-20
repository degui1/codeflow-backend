import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { DefaultEventsMap, Socket } from 'socket.io';
import { z } from 'zod';

import { GetFlowSchemaUseCase } from 'src/domain/use-cases/flowSchema/get-flow-schema.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { YamlSchema } from 'src/core/schemas/flow.schema';
// import { ValidadeFieldRulesUseCase } from 'src/domain/use-cases/flowSchema/validate-flow-field.use-case';
import { FlowInput } from 'src/core/schemas/data.schema';
import * as jsonata from 'jsonata';
import { stringify } from 'yaml';

const getFlowSchemaBodySchema = z.object({
  flowSchemaId: z.string().uuid(),
});

export const setFlowFieldSchema = z.object({
  groupKey: z.string(),
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
  // private updateFlowData(data: FlowData, input: InputSchema) {
  //   const { groupKey, fieldKey, value } = input;

  //   // if ('index' in input) {
  //   //   if (!Array.isArray(data.groups[groupKey])) data.groups[groupKey] = [];
  //   //   if (!data.groups[groupKey][input.index])
  //   //     data.groups[groupKey][input.index] = {};
  //   //   data.groups[groupKey][input.index][fieldKey] = value;
  //   // } else {
  //   if (!data.groups[groupKey]) data.groups[groupKey] = {};
  //   data.groups[groupKey][fieldKey] = value;
  //   // }
  // }

  // private buildFlowData(inputs: InputSchema[]): FlowData {
  //   const data: FlowData = { groups: {} };
  //   for (const input of inputs) {
  //     this.updateFlowData(data, input);
  //   }
  //   return data;
  // }

  constructor(
    private readonly getFlowSchemaUseCase: GetFlowSchemaUseCase,
    // private readonly validadeFieldRulesUseCase: ValidadeFieldRulesUseCase,
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

  setValueAtPath(obj: object, path: string, value: any) {
    const parts = path.split('.').filter(Boolean);
    let curr = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in curr)) curr[part] = {};
      curr = curr[part];
    }
    curr[parts[parts.length - 1]] = value;
  }

  @SubscribeMessage('set-field-data')
  async setFieldData(
    @MessageBody(new ZodValidationPipe(setFlowFieldSchema))
    body: SetFlowField,
    @ConnectedSocket() client: FlowSocket,
  ) {
    const response = await jsonata(body.path).evaluate(client.data.schema);

    this.setValueAtPath(client.data.inputs as object, body.path, body.value);

    const file = stringify(client.data.inputs);
    // await this.validadeFieldRulesUseCase.execute(body, flowData);

    // client.data.inputs?.push(body);

    return client.emit('set-field-data', {
      response,
      inputs: client.data.inputs,
      file,
    });
  }
}
