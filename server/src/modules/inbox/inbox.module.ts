import { Module } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InboxMessage,
  InboxMessageSchema,
  InboxRoom,
  InboxRoomSchema,
  Sender,
  SenderSchema,
} from './entities/inbox.entity';
import { CustomersModule } from 'src/modules/customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InboxMessage.name, schema: InboxMessageSchema },
      { name: InboxRoom.name, schema: InboxRoomSchema },
      { name: Sender.name, schema: SenderSchema },
    ]),
    CustomersModule,
  ],
  controllers: [InboxController],
  providers: [InboxService],
  exports: [InboxService],
})
export class InboxModule {}
