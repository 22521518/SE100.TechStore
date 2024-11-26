import { Module } from '@nestjs/common';
import { MessageGateway } from './gateway/message.gateway';
import { InboxModule } from 'src/modules/inbox/inbox.module';

@Module({
  providers: [MessageGateway],
  exports: [MessageGateway],
  imports: [InboxModule],
})
export class EventMessageModule {}
