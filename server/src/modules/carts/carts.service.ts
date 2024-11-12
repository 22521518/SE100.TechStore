import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class CartsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}
  async create(createCartDto: Prisma.Cart_ItemCreateInput) {
    try {
      const item = await this.prismaDbService.cart_Item.upsert({
        where: {
          customer_id_product_id: {
            customer_id: createCartDto.customer.connect.customer_id,
            product_id: createCartDto.product.connect.product_id, // Assuming you are using connect for product relation
          },
        },
        update: {
          quantity: createCartDto.quantity,
        },
        create: {
          customer: {
            connect: {
              customer_id: createCartDto.customer.connect.customer_id,
            },
          },
          product: {
            connect: { product_id: createCartDto.product.connect.product_id },
          },
          quantity: createCartDto.quantity ?? 1, // Default quantity
        },
      });
      return item;
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

  async update(
    customerId: string,
    productId: string,
    updateCartDto: Prisma.Cart_ItemUpdateInput,
  ) {
    try {
      const item = await this.prismaDbService.cart_Item.update({
        where: {
          customer_id_product_id: {
            customer_id: customerId,
            product_id: productId,
          },
        },
        data: updateCartDto,
      });
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating cart item');
    }
  }

  async removeAll(customer_id: string) {
    try {
      const customer = await this.prismaDbService.customers.update({
        data: {
          cart: {
            deleteMany: {},
          },
        },
        where: {
          customer_id: customer_id,
        },
      });
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting cart item');
    }
  }

  async remove(customerId: string, product_id: string) {
    try {
      const item = await this.prismaDbService.cart_Item.delete({
        where: {
          customer_id_product_id: {
            customer_id: customerId,
            product_id: product_id,
          },
        },
      });
      return item;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting cart item');
    }
  }
}