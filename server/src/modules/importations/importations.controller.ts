import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ImportationsService } from './importations.service';
import { Prisma } from '@prisma/client';
import { CreateImportationDto } from './dto/create-importation.dto';
import { UpdateImportationDto } from './dto/update-importation.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ProductsService } from '../products/products.service';

@Controller('importations')
export class ImportationsController {
  constructor(
    private readonly importationsService: ImportationsService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @Permissions(['importation-create'])
  async create(
    @Body()
    createImportationDto: CreateImportationDto,
  ) {
    try {
      const { supplier_id, import_items, ...imprt } = createImportationDto;
      const importItems: Prisma.Import_ItemsCreateManyImportationInput[] = [];
      console.log(createImportationDto);

      for (const item of import_items) {
        const product = await this.productsService.findOne(item.product_id);
        if (!product) {
          throw new NotFoundException(
            `Product with id ${item.product_id} does not exist`,
          );
        }

        importItems.push({
          ...item,
          product_id: item.product_id,
        });
      }

      if (!import_items || importItems.length === 0) {
        throw new BadRequestException(
          'There is no import_items provided for the importation',
        );
      }

      const totalPrice = import_items.reduce(
        (acc, item) => acc + item.total_price,
        0,
      );
      const imprtDto: Prisma.ImportationsCreateInput = {
        ...imprt,
        total_price: totalPrice,
        supplier: {
          connect: { supplier_id: supplier_id },
        },
        import_items: {
          createMany: {
            data: importItems,
          },
        },
      };

      const importation = await this.importationsService.create(
        imprtDto,
        import_items,
      );
      console.log(importation);
      return importation;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @Permissions(['importation-read'])
  async findAll() {
    try {
      const importation = await this.importationsService.findAll();

      return importation;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @Permissions(['importation-read'])
  async findOne(@Param('id') id: string) {
    try {
      const importation = await this.importationsService.findOne(+id);
      if (!importation) {
        throw new NotFoundException(`Importation with ID ${id} not found`);
      }

      return importation;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Patch(':id')
  @Permissions(['importation-update'])
  async update(
    @Param('id') id: string,
    @Body() updateImportationDto: UpdateImportationDto,
  ) {
    try {
      const importationDto: Prisma.ImportationsUpdateInput = {
        ...updateImportationDto,
      };
      const importation = await this.importationsService.update(
        +id,
        importationDto,
      );
      return importation;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Delete(':id')
  @Permissions(['importation-delete'])
  async remove(@Param('id') id: string) {
    try {
      const importation = await this.importationsService.remove(+id);
      return importation;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
