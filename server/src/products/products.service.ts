import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createProductDto: Prisma.ProductsCreateInput) {
    try {
      const product = await this.prismaDbService.products.create({
        data: createProductDto,
      });
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const products = await this.prismaDbService.products.findMany();
      return products;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prismaDbService.products.findUnique({
        where: { product_id: id },
      });
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, updateProductDto: Prisma.ProductsUpdateInput) {
    try {
      const product = await this.prismaDbService.products.update({
        where: { product_id: id },
        data: updateProductDto,
      });
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prismaDbService.products.delete({
        where: { product_id: id },
      });
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
