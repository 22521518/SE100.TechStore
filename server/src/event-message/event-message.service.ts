import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessageGateway } from 'src/event-message/gateway/message.gateway';

@Injectable()
export class EventMessageService implements OnModuleInit {
  constructor(private readonly messageGateway: MessageGateway) {}

  onModuleInit() {
    this.sendMessageToAll({
      sender: 'Server',
      content: 'Hello, everyone!',
    });
  }

  sendMessageToAll(message: { sender: string; content: string }) {
    this.messageGateway.server.emit('message', message);
  }
}
