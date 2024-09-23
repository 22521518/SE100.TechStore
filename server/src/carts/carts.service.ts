import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class CartsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}
  create(createCartDto: Prisma.Cart_ItemCreateInput) {
    try {
      return createCartDto;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating cart item');
    }
  }

  async findAll(customerId: string) {
    try {
      const cart_items = await this.prismaDbService.cart_Item.findMany({
        where: {
          customer_id: customerId,
        },
        include: {
          product: true,
        },
      });
      return cart_items;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching cart item');
    }
  }

  async update(customerId: string, updateCartDto: Prisma.Cart_ItemUpdateInput) {
    try {
      console.log(customerId);
      console.log(updateCartDto);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating cart item');
    }
  }

  async remove(customerId: string) {
    try {
      return customerId;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting cart item');
    }
  }
}
