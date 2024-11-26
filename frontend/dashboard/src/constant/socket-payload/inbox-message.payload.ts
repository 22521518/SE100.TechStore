import {
  ICustomer,
  IInboxMessage,
  IInboxRoomCard
} from '@constant/interface.constant';

export type RoomConnection = {
  room_id: string;
  socket_id?: string[];
};

export type UserConnection = {
  socket_id: string;
  user_id: string;
};

export type InboxMessagePayload = {
  room_id: string;
  customer: ICustomer;
  message: IInboxMessage;
};

export type GetMoreMessagePayload = {
  room_id: string;
  skip: number;
};

export type MoreMessagePayload = {
  messages: IInboxMessage[];
  room_id?: string;
};

export type ConversationPayload = Partial<IInboxRoomCard>;
