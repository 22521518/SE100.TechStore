import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { AddressesService } from '../addresses/addresses.service';
import { ShippingAddress } from './entities/order.entity';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly prismaDbService: PrismaDbService,
    private readonly ordersService: OrdersService,
    private readonly addressesService: AddressesService,
  ) {}

  @Post(':id')
  @Permissions(['order-create'])
  async create(
    @Param('id') customerId: string,
    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    try {
      const { order_items, voucher_code, shipping_address, ...ord } =
        createOrderDto;

      if (!shipping_address) {
        throw new BadRequestException('Shipping address not found');
      }

      const addressDto: Prisma.Customer_AddressCreateInput = {
        customer: {
          connect: {
            customer_id: customerId,
          },
        },
        ...shipping_address,
        is_primary: true,
      };
      const existingAddress =
        await this.prismaDbService.customer_Address.findFirst({
          where: {
            customer_id: customerId,
            city: shipping_address.city,
            district: shipping_address.district,
            ward: shipping_address.ward,
            address: shipping_address.address,
          },
        });
      if (!existingAddress) {
        await this.addressesService.create(addressDto);
      }

      const shippingAddress: ShippingAddress = {
        city: shipping_address.city,
        district: shipping_address.district,
        ward: shipping_address.ward,
        address: shipping_address.address,

        full_name: shipping_address.full_name,
        phone_number: shipping_address.phone_number,
      };

      const orderDto: Prisma.OrdersCreateInput = {
        ...ord,
        shipping_address: {
          create: {
            ...shippingAddress,
          },
        },
        ...(voucher_code && {
          voucher: {
            connect: {
              voucher_code: voucher_code,
            },
          },
        }),
        order_items: {
          createMany: {
            data: order_items as Prisma.Order_ItemsCreateManyOrderInput[],
          },
        },
        customer: {
          connect: {
            customer_id: customerId,
          },
        },
      };

      const order = await this.ordersService.create(orderDto, order_items);
      return order;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message || 'Creating order failed');
    }
  }

  @Get()
  @Permissions(['order-read'])
  async findAll(
    @Query('q') query: string,
    @Query('order_status') order_status: string,
    @Query('payment_status') payment_status: string,
    @Query('customer_id') customerId: string,
    @Query('order_id') orderId: string,
    @Query('product') productQuery: string,
  ) {
    try {
      const productArray = productQuery ? productQuery.split(',') : [];
      const orders = await this.ordersService.findAll(
        query,
        order_status?.toUpperCase(),
        payment_status?.toUpperCase(),
        productArray,
        customerId,
        orderId,
      );
      return orders;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Fetching orders failed');
    }
  }

  @Get(':id')
  @Permissions(['order-read'])
  async findAllWithCustomer(@Param('id') customerId: string) {
    try {
      const order = await this.ordersService.findAllWithCustomer(customerId);
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Fetching orders failed');
    }
  }

  @Get(':id/:order_id')
  @Permissions(['order-read'])
  async findOne(
    @Param('id') customerId: string,
    @Param('order_id') orderId: string,
  ) {
    try {
      const order = await this.ordersService.findOne(customerId, orderId);
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Fetching order');
    }
  }

  @Patch(':id/:order_id')
  @Permissions(['order-update'])
  async update(
    @Param('id') customerId: string,
    @Param('order_id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const orderDto: Prisma.OrdersUpdateInput = {
        order_status: updateOrderDto.order_status,
      };
      const order = await this.ordersService.update(orderId, orderDto);
      return { ...order };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Updating order failed');
    }
  }

  @Delete('-1')
  @Permissions(['order-delete'])
  async removeAll() {
    try {
      const order = await this.ordersService.removeAll();
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Deleting order failed');
    }
  }

  @Delete(':id/:order_id')
  @Permissions(['order-delete'])
  async remove(
    @Param('id') customerId: string,
    @Param('order_id') orderId: string,
  ) {
    try {
      const order = await this.ordersService.remove(customerId, orderId);
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Deleting order failed');
    }
  }
}
