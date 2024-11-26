import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { handleImageJpgBaseString } from 'src/utils/image.utils';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permissions(['product-create'])
  async create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    try {
      const { categories, attributes, images, ...product_info } =
        createProductDto;

      const imageFiles = await Promise.all(
        images.map(handleImageJpgBaseString),
      );

      const productDto: Prisma.ProductsCreateInput = {
        ...product_info,
        images: [],
        discount: product_info.discount || 0,
        categories: {
          connect: categories.map((cat) => ({
            category_id: cat.category_id,
          })) as Prisma.CategoriesWhereUniqueInput[],
        },
      };

      const product = await this.productsService.create(
        productDto,
        attributes,
        imageFiles as Express.Multer.File[],
      );

      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating product failed');
    }
  }

  @Get()
  @Permissions(['product-read'])
  async findAll(
    @Query('pageSize') limit: string,
    @Query('current') offset: string,
    @Query('product_name') product_name: string = '',
  ) {
    try {
      const product = await this.productsService.findAll(
        +limit,
        (+offset > 0 ? +offset - 1 : 0) * +limit,
        product_name,
      );
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching product failed');
    }
  }

  @Get(':id')
  @Permissions(['product-read'])
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
  @Permissions(['product-update'])
  @UseInterceptors(FilesInterceptor('images', 6))
  async update(
    @Param('id') id: string,
    @Body()
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const { categories, attributes, images, ...product_info } =
        updateProductDto;

      const imageFiles = await Promise.all(
        images.map(handleImageJpgBaseString),
      );

      const productDto: Prisma.ProductsUpdateInput = {
        ...product_info,
        images: [],
        categories: {
          set: categories?.map((category) => ({
            category_id: category.category_id,
          })) as Prisma.CategoriesWhereUniqueInput[],
        },
      };
      const product = await this.productsService.update(
        id,
        productDto,
        attributes,
        imageFiles as Express.Multer.File[],
      );
      return product;
      // return updateProductDto;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating product failed');
    }
  }

  @Delete(':id')
  @Permissions(['product-delete'])
  async remove(@Param('id') id: string) {
    try {
      const product = await this.productsService.remove(id);
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting product failed');
    }
  }

  @Delete()
  @Permissions(['product-delete'])
  async removeAll() {
    try {
      const product = await this.productsService.removeAll();
      return product;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting all products failed');
    }
  }
}
