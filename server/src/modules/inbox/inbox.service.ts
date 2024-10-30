import { BadRequestException, Injectable } from '@nestjs/common';
import { InboxMessage, InboxRoom, Sender } from './entities/inbox.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateInboxMessageDto } from './dto/create-inbox.dto';
import { CustomersService } from 'src/modules/customers/customers.service';

@Injectable()
export class InboxService {
  constructor(
    @InjectModel(InboxRoom.name)
    private readonly inboxRoomModel: mongoose.Model<InboxRoom>,
    @InjectModel(InboxMessage.name)
    private readonly inboxMessageModel: mongoose.Model<InboxMessage>,
    @InjectModel(Sender.name)
    private readonly senderModel: mongoose.Model<Sender>,
    private readonly customerService: CustomersService,
  ) {}

  private async findCustomer(customer_id: string) {
    let customer = null;
    try {
      customer = await this.customerService.findOne(customer_id);
    } finally {
      return customer;
    }
  }

  private async createSender(sender: Sender) {
    try {
      const existingSender = await this.senderModel.findOne({
        sender_name: sender.sender_name,
      });

      if (existingSender) {
        return existingSender;
      }

      const newSender = new this.senderModel(sender);
      return await newSender.save();
    } catch (error) {
      console.log(error);
    }
  }

  private async createInboxMessage(inboxMessage: InboxMessage) {
    try {
      const newInboxMessage = new this.inboxMessageModel({
        ...inboxMessage,
      });
      await newInboxMessage.save();
      return newInboxMessage;
    } catch (error) {
      console.log(error);
    }
  }

  private async findOrCreateInboxRoom(customer_id: string) {
    try {
      let inboxRoom = await this.inboxRoomModel.findOne({ customer_id });

      if (!inboxRoom) {
        const customer = await this.findCustomer(customer_id);
        if (customer) {
          inboxRoom = new this.inboxRoomModel({ customer_id });
          await inboxRoom.save();
        } else {
          throw new BadRequestException('Customer not found');
        }
      }

      return inboxRoom;
    } catch (error) {
      console.log(error);
    }
  }

  private async removeInboxMessage(inboxMessageId: string) {
    try {
      const message =
        await this.inboxMessageModel.findByIdAndDelete(inboxMessageId);
      return message;
    } catch (error) {
      console.log(error);
    }
  }

  private async removeSender(senderDocumentId: string) {
    try {
      return await this.senderModel.findByIdAndDelete(senderDocumentId);
    } catch (error) {
      console.log(error);
    }
  }

  async create(customer_id: string, inboxMessage: CreateInboxMessageDto) {
    try {
      const sender = await this.createSender(inboxMessage.sender);
      const newInboxMessage = await this.createInboxMessage({
        sender: sender._id,
        is_seen: inboxMessage.is_seen || false,
        message: inboxMessage.message,
        created_at: new Date(),
      });

      const inboxRoom = await this.findOrCreateInboxRoom(customer_id);
      inboxRoom.messages.push(newInboxMessage._id);
      await inboxRoom.save();

      const room = await this.getMessageByRoom(customer_id, 0, 20, false);
      return {
        ...room,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(skip: number = 0, limit: number = 10) {
    try {
      const inboxRoom = await this.inboxRoomModel
        .aggregate([
          {
            $lookup: {
              from: 'inboxmessages',
              localField: 'messages',
              foreignField: '_id',
              as: 'allMessages',
            },
          },
          {
            $unwind: {
              path: '$allMessages',
              preserveNullAndEmptyArrays: true,
            },
          },

          { $sort: { 'allMessages.created_at': -1 } },
          {
            $lookup: {
              from: 'senders',
              localField: 'allMessages.sender',
              foreignField: '_id',
              as: 'senderInfo',
            },
          },
          {
            $lookup: {
              from: 'senders', // replace with the actual sender collection name
              localField: 'allMessages.sender',
              foreignField: '_id',
              as: 'senderInfo',
            },
          },
          {
            $unwind: {
              path: '$senderInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: '$_id',
              customer_id: { $first: '$customer_id' },
              latestMessage: { $first: '$allMessages' },
              senderDetails: { $first: '$senderInfo' },
            },
          },
          {
            $project: {
              _id: 0,
              room_id: '$_id',
              customer_id: 1,
              latestMessage: {
                message: '$latestMessage.message',
                sender: {
                  sender_id: '$senderDetails.sender_id',
                  name: '$senderDetails.sender_name',
                },
                created_at: '$latestMessage.created_at',
                is_seen: '$latestMessage.is_seen',
              },
            },
          },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec();
      const resolvedRooms = await Promise.all(
        inboxRoom.map(async (room) => {
          const customer = await this.findCustomer(room.customer_id);
          if (!customer) {
            await this.inboxRoomModel.findByIdAndDelete(room.room_id);
          }
          return {
            room_id: room.room_id,
            customer: {
              customer_id: customer.customer_id,
              account_id: customer.account_id,
              username: customer.username,
              full_name: customer.full_name,
              phone_number: customer.phone_number,
              date_joined: customer.date_joined,
              account: {
                email: customer.account.email,
              },
            },
            latestMessage: {
              message: room.latestMessage.message,
              sender: room.latestMessage.sender,
              created_at: room.latestMessage.created_at,
              is_seen: room.latestMessage.is_seen,
            },
          };
        }),
      );

      return resolvedRooms;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching inbox failed');
    }
  }

  async findOnes(customer_id: string) {
    try {
      const inbox = await this.findOrCreateInboxRoom(customer_id);
      return inbox;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching inbox failed');
    }
  }

  async getMessageByRoom(
    customer_id: string,
    skip: number = 0,
    limit: number = 20,
    is_seen: boolean = false,
  ) {
    try {
      const findCustomer = await this.findCustomer(customer_id);
      if (!findCustomer) {
        throw new BadRequestException('Customer not found');
      }
      const room = await this.findOrCreateInboxRoom(customer_id);

      if (is_seen) {
        await this.inboxMessageModel.updateMany(
          {
            _id: {
              $in: room.messages,
            },
            is_seen: false,
          },
          { is_seen: true },
        );
        // console.log(res);
      }
      const customer = await this.findCustomer(customer_id);

      const inboxRoom = await this.inboxRoomModel
        .aggregate([
          { $match: { customer_id: customer_id } },
          {
            $lookup: {
              from: 'inboxmessages',
              localField: 'messages',
              foreignField: '_id',
              as: 'messages',
            },
          },
          { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
          { $sort: { 'messages.created_at': -1 } },

          // Additional lookup to get sender information
          {
            $lookup: {
              from: 'senders', // Replace with the actual sender collection name
              localField: 'messages.sender',
              foreignField: '_id',
              as: 'senderInfo',
            },
          },
          {
            $unwind: { path: '$senderInfo', preserveNullAndEmptyArrays: true },
          },

          {
            $group: {
              _id: '$_id',
              customer_id: { $first: '$customer_id' },
              messages: {
                $push: {
                  _id: '$messages._id',
                  message: '$messages.message',
                  created_at: '$messages.created_at',
                  is_seen: '$messages.is_seen',
                  senderInfo: '$senderInfo',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              room_id: '$_id',
              customer_id: 1,
              customer: customer,
              messages: {
                $map: {
                  input: { $slice: ['$messages', skip, limit] },
                  as: 'message',
                  in: {
                    message_id: '$$message._id',
                    message: '$$message.message',
                    created_at: '$$message.created_at',
                    is_seen: '$$message.is_seen',
                    sender: {
                      sender_id: '$$message.senderInfo.sender_id', // Adjust field names to match sender collection
                      name: '$$message.senderInfo.sender_name',
                    },
                  },
                },
              },
            },
          },
        ])
        .exec();

      return {
        ...inboxRoom[0],
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching inbox failed');
    }
  }

  async update(id: string, updateInboxDto: any) {
    return `This action updates a #${id} inbox: ${updateInboxDto}`;
  }

  async remove(id: string) {
    try {
      const inbox = await this.removeInboxMessage(id);
      await this.removeSender(inbox.sender._id.toString());
      return {
        ...inbox,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting inbox failed');
    }
  }
}
