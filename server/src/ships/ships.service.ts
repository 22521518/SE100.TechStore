import { BadRequestException, Injectable } from '@nestjs/common';
import { ORDER_STATUS, Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class ShipsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(
    createShipDto: Prisma.Shipping_AddressCreateInput,
    including_order: boolean = true,
    including_address: boolean = true,
  ) {
    try {
      // Create the shipping address and include related order/address data
      const ship = await this.prismaDbService.shipping_Address.create({
        data: createShipDto,
        include: {
          order: including_order && { include: { customer: true } }, // Conditionally include order and customer
          address: including_address, // Conditionally include address
        },
      });

      // Attempt to update the order status to SHIPPED
      const order = await this.prismaDbService.orders.update({
        where: { order_id: ship.order_id },
        data: { order_status: ORDER_STATUS.SHIPPED },
      });

      // If no order is found, delete the shipping address and throw an error
      if (!order) {
        await this.prismaDbService.shipping_Address.delete({
          where: { shipping_id: ship.shipping_id },
        });
        throw new BadRequestException('Error creating ship - order not found');
      }
      ship.order.order_status = order.order_status;
      return ship;
    } catch (error) {
      console.error(error);

      // If shipping address is already created but order update fails, delete the shipping record
      if (error.message.includes('order not found')) {
        await this.prismaDbService.shipping_Address.delete({
          where: { shipping_id: createShipDto.shipping_id }, // Assuming `shipping_id` is part of `createShipDto`
        });
      }

      throw new BadRequestException('Error creating ship');
    }
  }

  async findAll(
    including_order: boolean = true,
    including_address: boolean = true,
  ) {
    try {
      const ship = await this.prismaDbService.shipping_Address.findMany({
        include: {
          order: {
            include: {
              customer: including_order,
            },
          },
          address: including_address,
        },
      });
      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching ships');
    }
  }

  async findOne(
    id: string,
    including_order: boolean = true,
    including_address: boolean = true,
  ) {
    try {
      const ship = await this.prismaDbService.shipping_Address.findUnique({
        where: {
          shipping_id: id,
        },
        include: {
          order: {
            include: {
              customer: including_order,
            },
          },
          address: including_address,
        },
      });

      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching ship');
    }
  }

  async update(
    id: string,
    updateShipDto: Prisma.Shipping_AddressUpdateInput,
    including_order: boolean = true,
    including_address: boolean = true,
  ) {
    try {
      const ship = await this.prismaDbService.shipping_Address.update({
        where: {
          shipping_id: id,
        },
        data: updateShipDto,
        include: {
          order: {
            include: {
              customer: including_order,
            },
          },
          address: including_address,
        },
      });

      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating ship');
    }
  }

  async remove(
    id: string,
    including_order: boolean = true,
    including_address: boolean = true,
  ) {
    try {
      const ship = await this.prismaDbService.shipping_Address.delete({
        where: {
          shipping_id: id,
        },
        include: {
          order: {
            include: {
              customer: including_order,
            },
          },
          address: including_address,
        },
      });

      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting ship');
    }
  }
}
