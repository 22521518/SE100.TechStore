import { ICustomer, IInboxMessage } from './frontend.type';

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
