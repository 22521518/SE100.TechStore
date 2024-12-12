import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Prisma } from '@prisma/client';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Permissions(['category-create'])
  async create(@Body() createCategoryDto: CreateCategoriesDto) {
    try {
      const categoryDto: Prisma.CategoriesCreateInput = {
        category_name: createCategoryDto.category_name,
        description: createCategoryDto.description,
      };
      const category = await this.categoriesService.create(categoryDto);
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating category');
    }
  }

  @Get()
  @Permissions(['category-read'])
  async findAll(
    @Query('q') contain_category_name: string,
    @Query('pageSize') limit: string,
    @Query('current') offset: string,
  ) {
    try {
      const category = await this.categoriesService.findAll(
        +limit,
        (+offset > 0 ? +offset - 1 : 0) * +limit,
        contain_category_name,
      );
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching categories');
    }
  }

  @Get(':id')
  @Permissions(['category-read'])
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoriesService.findOne(+id);
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching category');
    }
  }

  @Get(':id/products')
  @Permissions(['category-read'])
  async findCategoryProducts(
    @Param('id') id: string,
    @Query('q') query: string,
    @Query('pageSize') limit: string,
    @Query('current') offset: string,
  ) {
    try {
      const category = await this.categoriesService.findCategoryProducts(
        query,
        +id,
        +limit,
        (+offset > 0 ? +offset - 1 : 0) * +limit,
      );
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching category');
    }
  }

  @Patch(':id')
  @Permissions(['category-update'])
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoriesDto,
  ) {
    try {
      const categoryDto: Prisma.CategoriesUpdateInput = {
        category_name: updateCategoryDto.category_name,
        description: updateCategoryDto.description,
      };
      const category = await this.categoriesService.update(+id, categoryDto);
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating categories');
    }
  }

  @Delete(':id')
  @Permissions(['category-delete'])
  async remove(@Param('id') id: string) {
    try {
      const category = await this.categoriesService.remove(+id);
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error removing categories');
    }
  }
}
