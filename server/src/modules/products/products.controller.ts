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
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body()
    createProductDto: CreateProductDto,
  ) {
    try {
      const { categories, attributes, images, ...product_info } =
        createProductDto;

      const imageFiles = await Promise.all(
        images.map(async ({ name, url }) => {
          const base64Data = url.replace(/^data:image\/\w+;base64,/, '');
          const imageBuffer = Buffer.from(base64Data, 'base64');

          const compressedBuffer = await sharp(imageBuffer)
            .resize(500) // Resize if needed
            .jpeg({ quality: 80 }) // Adjust format and quality
            .toBuffer()
            .then((data) => data)
            .catch((err) => {
              throw new InternalServerErrorException(
                'Failed to compress image: ' + err,
              );
            });

          // Create a mock Express.Multer.File object
          return {
            fieldname: 'image',
            originalname: name,
            encoding: 'base64',
            mimetype: 'image/jpeg', // or whatever type you expect
            buffer: compressedBuffer,
            size: compressedBuffer.length,
          };
        }),
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
      console.log('product_name', product_name);
      console.log('offset', offset);
      console.log('limit', limit);
      console.log('length', product.length);
      console.log('\n--------\n');

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
        images.map(async ({ name, url }) => {
          const base64Data = url.replace(/^data:image\/\w+;base64,/, '');
          const imageBuffer = Buffer.from(base64Data, 'base64');

          const compressedBuffer = await sharp(imageBuffer)
            .resize(500) // Resize if needed
            .jpeg({ quality: 80 }) // Adjust format and quality
            .toBuffer()
            .then((data) => data)
            .catch((err) => {
              throw new InternalServerErrorException(
                'Failed to compress image: ' + err,
              );
            });

          // Create a mock Express.Multer.File object
          return {
            fieldname: 'image',
            originalname: name,
            encoding: 'base64',
            mimetype: 'image/jpeg', // or whatever type you expect
            buffer: compressedBuffer,
            size: compressedBuffer.length,
          };
        }),
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

  @Delete()
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
