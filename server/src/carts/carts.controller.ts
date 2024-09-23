import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { Prisma } from '@prisma/client';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async create(@Body() createCartDto: Prisma.Cart_ItemCreateInput) {
    try {
      const item = await this.cartsService.create(createCartDto);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Adding cart item failed');
    }
  }

  @Get('customer_id')
  async findAll(@Param('customer_id') customerId: string) {
    try {
      const item = await this.cartsService.findAll(customerId);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetch cart item failed');
    }
  }

  @Patch(':customer_id')
  async update(
    @Param('customer_id') customerId: string,
    @Body()
    updateCartDto: {
      quantity: Prisma.IntFieldUpdateOperationsInput | number;
      product_id: string;
    },
  ) {
    try {
      const item = await this.cartsService.update(customerId, updateCartDto);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating cart item failed');
    }
  }

  @Delete(':id')
  async remove(@Param('customer_id') customerId: string) {
    try {
      const item = await this.cartsService.remove(customerId);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting cart item failed');
    }
  }
}
