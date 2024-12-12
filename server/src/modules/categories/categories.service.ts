import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createCategoryDto: Prisma.CategoriesCreateInput) {
    try {
      const category = await this.prismaDbService.categories.create({
        data: createCategoryDto,
      });
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findAll(
    limit: number,
    offset: number,
    contain_category_name: string,
    including: boolean = false,
  ) {
    try {
      const categories = await this.prismaDbService.categories.findMany({
        where: {
          ...(contain_category_name
            ? {
                category_name: {
                  contains: contain_category_name,
                  mode: 'insensitive',
                },
              }
            : {}),
        },
        include: {
          products: including,
        },
        ...(offset ? { skip: offset } : {}),
        ...(limit ? { take: limit } : {}),
      });
      return categories;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number, including: boolean = false) {
    try {
      const category = await this.prismaDbService.categories.findUnique({
        where: { category_id: id },
        include: {
          products: including,
        },
      });
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findCategoryProducts(
    query: string = '',
    id: number,
    limit: number,
    offset: number,
  ) {
    try {
      const products = await this.prismaDbService.products.findMany({
        where: {
          OR: [
            {
              product_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              product_id: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
          categories: {
            some: {
              category_id: id,
            },
          },
        },
        include: { categories: true, product_feedbacks: true },
        ...(offset ? { skip: offset } : {}),
        ...(limit ? { take: limit } : {}),
      });
      return products;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async update(id: number, updateCategoryDto: Prisma.CategoriesUpdateInput) {
    try {
      const category = await this.prismaDbService.categories.update({
        where: { category_id: id },
        data: updateCategoryDto,
      });
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async remove(id: number, including: boolean = true) {
    try {
      const category = await this.prismaDbService.categories.delete({
        where: { category_id: id },
        include: {
          products: including,
        },
      });
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }
}
