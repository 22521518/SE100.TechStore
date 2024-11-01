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

  async findAll(contain_category_name: string, including: boolean = false) {
    try {
      const categories = await this.prismaDbService.categories.findMany({
        where: {
          ...(contain_category_name
            ? { category_name: { contains: contain_category_name } }
            : {}),
        },
        include: {
          products: including,
        },
      });
      return categories;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number, including: boolean = true) {
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
