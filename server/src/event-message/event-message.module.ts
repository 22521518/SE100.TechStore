import { Module } from '@nestjs/common';
import { EventMessageService } from './event-message.service';
import { MessageGateway } from './gateway/message.gateway';

@Module({
  providers: [EventMessageService, MessageGateway],
  exports: [EventMessageService, MessageGateway],
})
export class EventMessageModule {}
