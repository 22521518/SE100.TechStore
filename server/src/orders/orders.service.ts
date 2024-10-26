import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(
    createOrderDto: Prisma.OrdersCreateInput,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      const order = await this.prismaDbService.orders.create({
        data: createOrderDto,
        include: {
          order_items: including_items,
          customer: including_customer,
          voucher: including_voucher,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating order');
    }
  }

  async findAll(
    customerId: string,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      const orders = await this.prismaDbService.orders.findMany({
        where: {
          customer_id: customerId,
        },
        include: {
          order_items: {
            include: {
              product: including_items,
            },
          },
          customer: including_customer,
          voucher: including_voucher,
          shipping_address: {
            include: {
              address: true,
            },
          },
        },
      });
      return orders;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching order');
    }
  }

  async findOne(
    customerId: string,
    orderId: string,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      const order = await this.prismaDbService.orders.findUnique({
        where: {
          order_id: orderId,
          customer_id: customerId,
        },
        include: {
          order_items: including_items,
          customer: including_customer,
          voucher: including_voucher,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching orders');
    }
  }

  async update(
    orderId: string,
    updateOrderDto: Prisma.OrdersUpdateInput,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      const order = await this.prismaDbService.orders.update({
        where: { order_id: orderId },
        data: updateOrderDto,
        include: {
          order_items: including_items,
          customer: including_customer,
          voucher: including_voucher,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating order');
    }
  }

  async remove(
    customerId: string,
    orderId: string,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      const order = await this.prismaDbService.orders.delete({
        where: { order_id: orderId, customer_id: customerId },
        include: {
          order_items: including_items,
          customer: including_customer,
          voucher: including_voucher,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting order');
    }
  }
}
