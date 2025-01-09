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
      await Promise.all(
        order_items.map(async (orderItem) => {
          const product = await this.prismaDbService.products.findUnique({
            where: {
              product_id: orderItem.product_id,
            },
          });

          if (!product) {
            throw new BadRequestException('Product not found');
          }
        }),
      );

      await Promise.all(
        order_items.map(async (orderItem) => {
          try {
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
          } catch (error) {
            throw new BadRequestException(
              `Error updating stock quantity for product ${orderItem.product_id}, ${error.message}`,
            );
          }
        }),
      );

      const order = await this.prismaDbService.orders.create({
        data: createOrderDto,
        include: {
          order_items: {
            include: {
              product: including_items,
            },
          },
          customer: including_customer,
          voucher: including_voucher,
          shipping_address: true,
        },
      });

      return order;
    } catch (error) {
      throw new BadRequestException(error.message || 'Error creating order');
    }
  }

  async findAll(
    query: string = '',
    order_status: string = '',
    payment_status: string = '',
    productArray: string[] = [],
    customer_id: string,
    order_id: string,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    const orArray = [];
    if (query) {
      orArray.push(
        {
          order_id: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          customer_id: {
            contains: query,
            mode: 'insensitive',
          },
        },
      );
    }

    productArray.forEach((productQuery) => {
      orArray.push({
        order_items: {
          some: {
            product: {
              OR: [
                {
                  product_name: {
                    contains: productQuery.trim(),
                    mode: 'insensitive',
                  },
                },
                {
                  product_id: {
                    contains: productQuery.trim(),
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        },
      });
    });

    if (order_status) {
      orArray.push({ order_status });
    }

    if (payment_status) {
      orArray.push({ payment_status });
    }

    try {
      const orders = await this.prismaDbService.orders.findMany({
        where: {
          ...(orArray.length > 0
            ? {
                OR: orArray,
              }
            : {}),
          ...(customer_id
            ? {
                customer_id: {
                  contains: customer_id,
                  mode: 'insensitive',
                },
              }
            : {}),
          ...(order_id
            ? {
                order_id: {
                  contains: order_id,
                  mode: 'insensitive',
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
      return orders.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Error fetching orders');
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
        },
      });

      return orders.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching order');
    }
  }

  async findByOrderId(
    orderId: string,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      if (!orderId) {
        throw new BadRequestException('Order ID is required');
      }

      const order = await this.prismaDbService.orders.findUnique({
        where: {
          order_id: orderId,
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
      throw new BadRequestException(error.meta || 'Error fetching orders');
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
          shipping_address: true,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.meta || 'Error fetching orders');
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
          shipping_address: true,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.meta || 'Error updating order');
    }
  }

  async removeById(
    orderId: string,
    including_items: boolean = true,
    including_customer: boolean = true,
    including_voucher: boolean = true,
  ) {
    try {
      const order = await this.prismaDbService.orders.delete({
        where: { order_id: orderId },
        include: {
          order_items: including_items,
          customer: including_customer,
          voucher: including_voucher,
        },
      });

      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.meta || 'Error deleting order');
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
      throw new BadRequestException(error.meta || 'Error deleting order');
    }
  }

  async removeAll() {
    try {
      return await this.prismaDbService.orders.deleteMany({});
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.meta || 'Error deleting all orders');
    }
  }
}
