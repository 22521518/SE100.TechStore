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
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    try {
      const { categories, images, attributes, ...product_info } =
        createProductDto;
      console.log(attributes, images);
      const productDto: Prisma.ProductsCreateInput = {
        ...product_info,
        categories: {
          connect: categories.map((cat) => ({
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
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const { categories, attributes, ...product_info } = updateProductDto;
      console.log(attributes);
      const productDto: Prisma.ProductsUpdateInput = {
        ...product_info,
        categories: {
          set: categories.map(
            (category_id) => category_id,
          ) as Prisma.CategoriesWhereUniqueInput[],
        },
      };
      const product = await this.productsService.update(id, productDto);
      return product;
    } catch (error) {
      console.error(error);
      console.error(updateProductDto);
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
