import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { Prisma } from '@prisma/client';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post(':id')
  @Permissions(['cart-create'])
  async create(
    @Param('id') customerId: string,
    @Body()
    createCartDto: CreateCartDto,
  ) {
    try {
      const cartDto: Prisma.Cart_ItemCreateInput = {
        product: {
          connect: {
            product_id: createCartDto.product_id,
          },
        },
        customer: {
          connect: {
            customer_id: customerId,
          },
        },
        quantity: createCartDto.quantity,
      };
      const item = await this.cartsService.create(cartDto);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Adding cart item failed');
    }
  }

  @Get(':id')
  @Permissions(['cart-read'])
  async findAll(@Param('id') customerId: string) {
    try {
      const item = await this.cartsService.findAll(customerId);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetch cart item failed');
    }
  }

  @Put(':id')
  @Permissions(['cart-update'])
  async updateWhole(
    @Param('id') customerId: string,
    @Body()
    updateCartDto: UpdateCartDto,
  ) {
    try {
      const cartDto: Prisma.Cart_ItemCreateInput = {
        product: {
          connect: {
            product_id: updateCartDto.product_id,
          },
        },
        customer: {
          connect: {
            customer_id: customerId,
          },
        },
        quantity: updateCartDto.quantity,
      };
      const item = await this.cartsService.create(cartDto);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Reset cart item failed');
    }
  }

  @Patch(':id')
  @Permissions(['cart-update'])
  async update(
    @Param('id') customerId: string,
    @Body()
    updateCartDto: UpdateCartDto,
  ) {
    try {
      const cartDto: Prisma.Cart_ItemUpdateInput = {
        quantity: updateCartDto.quantity,
      };
      const item = await this.cartsService.update(
        customerId,
        updateCartDto.product_id,
        cartDto,
      );
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating cart item failed');
    }
  }

  @Delete(':id/:product_id')
  @Permissions(['cart-delete'])
  async remove(
    @Param('id') customerId: string,
    @Param('product_id') productId: string,
  ) {
    try {
      const item = await this.cartsService.remove(customerId, productId);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting cart item failed');
    }
  }

  @Delete(':id')
  @Permissions(['cart-delete'])
  async removeAll(@Param('id') customerId: string) {
    try {
      const item = await this.cartsService.removeAll(customerId);
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting all cart items failed');
    }
  }
}
