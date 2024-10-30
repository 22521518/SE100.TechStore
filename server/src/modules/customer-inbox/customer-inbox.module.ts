import { Module } from '@nestjs/common';
import { CustomerInboxController } from './customer-inbox.controller';
import { InboxModule } from 'src/modules/inbox/inbox.module';

@Module({
  controllers: [CustomerInboxController],
  imports: [InboxModule],
})
export class CustomerInboxModule {}
