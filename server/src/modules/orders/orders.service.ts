import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';
import { OrderItems } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(
    createOrderDto: Prisma.OrdersCreateInput,
    order_items: OrderItems[],
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      console.log('createOrderDto', createOrderDto);
      order_items.forEach(async (orderItem) => {
        await this.prismaDbService.products.update({
          where: {
            product_id: orderItem.product_id,
          },
          data: {
            stock_quantity: {
              decrement: orderItem.quantity,
            },
          },
        });
      });

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
    customer_id: string,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      const orders = await this.prismaDbService.orders.findMany({
        where: {
          ...(customer_id
            ? {
                customer_id: {
                  equals: customer_id,
                },
              }
            : {}),
        },
        include: {
          order_items: including_items,
          customer: including_customer,
          voucher: including_voucher,
        },
      });
      return orders;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching orders');
    }
  }

  async findAllWithCustomer(
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
