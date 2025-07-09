import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { z } from 'zod';

import { GetFlowSchemaUseCase } from 'src/domain/use-cases/flowSchema/get-flow-schema.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

const getFlowSchemaBodySchema = z.object({
  flowSchemaId: z.string().uuid(),
});

type GetFlowSchemaBodySchema = z.infer<typeof getFlowSchemaBodySchema>;

@WebSocketGateway()
export class FlowGateway {
  constructor(private readonly getFlowSchemaUseCase: GetFlowSchemaUseCase) {}

  @SubscribeMessage('get-flow-schema')
  async getFlowSchema(
    // @MessageBody(new ZodValidationPipe(getFlowSchemaBodySchema))
    // body: GetFlowSchemaBodySchema,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { schema } = await this.getFlowSchemaUseCase.execute({
        flowSchemaId: '',
      });
      return client.emit('get-flow-schema', schema);
    } catch (error) {
      throw new WsException(error);
    }
  }
}
