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
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body()
    createProductDto: Prisma.ProductsCreateInput & {
      category: [{ category_id: string }];
    },
  ) {
    try {
      const { category, ...product_info } = createProductDto;
      const productDto: Prisma.ProductsCreateInput = {
        ...product_info,
        category: {
          connect: category.map((cat) => ({
            category_id: cat.category_id,
          })) as Prisma.CategoriesWhereUniqueInput[],
        },
      };
      const product = await this.productsService.create(productDto);
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating product failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const product = await this.productsService.findAll();
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching product failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching product failed');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateProductDto: Prisma.ProductsUpdateInput & {
      category: { category_id: number }[];
    },
  ) {
    try {
      const { category, ...product_info } = updateProductDto;
      const productDto: Prisma.ProductsUpdateInput = {
        ...product_info,
        category: {
          set: category.map(
            (category_id) => category_id,
          ) as Prisma.CategoriesWhereUniqueInput[],
        },
      };
      const product = await this.productsService.update(id, productDto);
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating product failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const product = await this.productsService.remove(id);
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting product failed');
    }
  }
}
