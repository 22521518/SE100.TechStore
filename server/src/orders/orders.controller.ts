import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':id')
  async create(
    @Param('id') customerId: string,
    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    try {
      const { order_items, voucher_code, ...ord } = createOrderDto;
      const orderDto: Prisma.OrdersCreateInput = {
        ...ord,
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

      const order = await this.ordersService.create(orderDto);
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating order failed');
    }
  }

  @Get(':id')
  async findAll(@Param('id') customerId: string) {
    try {
      const order = await this.ordersService.findAll(customerId);
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching orders failed');
    }
  }

  @Get(':id/:order_id')
  async findOne(
    @Param('id') customerId: string,
    @Param('order_id') orderId: string,
  ) {
    try {
      const order = await this.ordersService.findOne(customerId, orderId);
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching order');
    }
  }

  @Patch(':id/:order_id')
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
      throw new BadRequestException('Updating order failed');
    }
  }

  @Delete(':id/:order_id')
  async remove(
    @Param('id') customerId: string,
    @Param('order_id') orderId: string,
  ) {
    try {
      const order = await this.ordersService.remove(customerId, orderId);
      return order;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting order failed');
    }
  }
}
