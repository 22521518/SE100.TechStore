import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  SOCKET_INBOX_CHANNEL,
  SOCKET_JOIN_CHANNEL,
} from '../subscribe-channel/message.channel';
import {
  GetMoreMessagePayload,
  RoomConnection,
  UserConnection,
} from '../type/payload.type';
import { InboxService } from 'src/modules/inbox/inbox.service';
import { InboxMessagePayload } from '../type/payload.type';

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

  private connectedCustomer: UserConnection[] = [];
  private connectedStaff: UserConnection[] = [];
  private connectedRooms: RoomConnection[] = [];

  constructor(private readonly inboxService: InboxService) {}

  handleConnection(client: Socket) {
    this.server
      .to(client.id)
      .emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client: Socket) {
    this.connectedStaff = this.connectedStaff.filter(
      (staff) => staff.socket_id != client.id,
    );
    this.connectedCustomer = this.connectedCustomer.filter(
      (customer) => customer.socket_id != client.id,
    );
  }

  @SubscribeMessage(SOCKET_JOIN_CHANNEL.STAFF_JOIN)
  handleStaffJoin(client: Socket, payload: UserConnection) {
    this.connectedStaff.push({
      socket_id: client.id,
      user_id: payload.user_id,
    });
  }

  @SubscribeMessage(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN)
  handleCustomerJoin(client: Socket, payload: UserConnection) {
    this.connectedCustomer.push({
      socket_id: client.id,
      user_id: payload.user_id,
    });
  }

  @SubscribeMessage(SOCKET_INBOX_CHANNEL.LEAVE_ROOM)
  handleLeaveRoom(client: Socket, payload: RoomConnection) {
    const room = this.connectedRooms.find(
      (room) => room.room_id === payload.room_id,
    );

    if (room) {
      room.socket_id = room.socket_id.filter(
        (socket_id) => socket_id != client.id,
      );

      if (room.socket_id.length === 0) {
        this.connectedRooms = this.connectedRooms.filter(
          (room) => room.room_id != payload.room_id,
        );
      }
    }
  }

  @SubscribeMessage(SOCKET_INBOX_CHANNEL.JOIN_ROOM)
  async handleJoinRoom(client: Socket, payload: RoomConnection) {
    const room = this.connectedRooms.find(
      (room) => room.room_id === payload.room_id,
    );

    if (room) {
      room.socket_id.push(client.id);
    } else if (payload.room_id) {
      this.connectedRooms.push({
        room_id: payload.room_id,
        socket_id: [client.id],
      });
    }

    const isStaff = this.connectedStaff.find(
      (staff) => staff.socket_id === client.id,
    );

    if (isStaff) {
      await this.inboxService.setSeen(payload.room_id);
    }
  }

  @SubscribeMessage(SOCKET_INBOX_CHANNEL.ADD_MESSAGE)
  async handleMessage(client: Socket, payload: InboxMessagePayload) {
    const room = this.connectedRooms.find(
      (room) => room.room_id === payload.room_id,
    );

    if (room) {
      room.socket_id.forEach(async (socketId) => {
        // check if the room has staff connected
        const staff = this.connectedStaff.find(
          (staff) => staff.socket_id === socketId,
        );
        let is_seen = false;
        if (staff) {
          await this.inboxService.setSeen(payload.room_id);
          is_seen = true;
        }

        this.connectedStaff.forEach((staff) => {
          this.server
            .to(staff.socket_id)
            .emit(SOCKET_INBOX_CHANNEL.GET_CONVERSATIONS, {
              room_id: payload.room_id,
              customer: payload.customer,
              latestMessage: {
                ...payload.message,
                is_seen: is_seen,
              },
            });
        });

        if (socketId !== client.id) {
          this.server
            .to(socketId)
            .emit(SOCKET_INBOX_CHANNEL.GET_MESSAGES, { ...payload, is_seen });
        }
      });
    }
  }

  @SubscribeMessage(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES)
  async handleGetMoreMessages(client: Socket, payload: GetMoreMessagePayload) {
    const { room_id, skip } = payload;
    const messages = await this.inboxService.getMessageByRoom(room_id, skip);
    this.server.to(client.id).emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, {
      messages: messages.messages,
    });
  }
}
