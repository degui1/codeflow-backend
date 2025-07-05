import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ExampleController {
  @SubscribeMessage('example')
  onExample(@MessageBody() body: unknown, @ConnectedSocket() client: Socket) {
    console.log('example', body);
    client.emit('example', ['1', '2']);
  }
}
