import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Sender {
  @Prop()
  sender_id: string;

  @Prop()
  sender_name: string;
}

@Schema({
  timestamps: true,
})
export class InboxMessage {
  @Prop()
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Sender' })
  sender: Types.ObjectId;

  @Prop()
  is_seen: boolean;

  @Prop()
  created_at: Date;
}

@Schema({
  timestamps: true,
})
export class InboxRoom {
  @Prop()
  customer_id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'InboxMessage' }] })
  messages: Types.ObjectId[];
}

export const SenderSchema = SchemaFactory.createForClass(Sender);

export const InboxMessageSchema = SchemaFactory.createForClass(InboxMessage);

export const InboxRoomSchema = SchemaFactory.createForClass(InboxRoom);
