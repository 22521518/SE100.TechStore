import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.server.emit('message', {
      sender: 'Server',
      content: 'Hello, new client!',
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected:${client.id}, ${client.data}`);

    this.server.emit('message', {
      sender: 'Server',
      content: 'Hello, new client!',
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: { sender: string; content: string },
  ): void {
    // Broadcast the message to all connected clients
    this.server.emit('message from server', message);
  }
}
