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

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
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
  async findAll(@Query('category') contain_category_name: string) {
    try {
      const category = await this.categoriesService.findAll(
        contain_category_name,
      );
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching categories');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoriesService.findOne(+id);
      return category;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching category');
    }
  }

  @Patch(':id')
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
