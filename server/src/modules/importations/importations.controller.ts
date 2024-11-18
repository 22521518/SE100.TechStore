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
import { ImportationsService } from './importations.service';
import { Prisma } from '@prisma/client';
import { CreateImportationDto } from './dto/create-importation.dto';
import { UpdateImportationDto } from './dto/update-importation.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('importations')
export class ImportationsController {
  constructor(private readonly importationsService: ImportationsService) {}

  @Post()
  @Permissions(['importation-create'])
  async create(
    @Body()
    createImportationDto: CreateImportationDto,
  ) {
    try {
      const { supplier_id, import_items, ...imprt } = createImportationDto;
      if (
        !import_items ||
        (import_items as Prisma.Import_ItemsCreateInput[]).length === 0
      ) {
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
            data: import_items as Prisma.Import_ItemsCreateManyImportationInput[],
          },
        },
      };

      const importation = await this.importationsService.create(imprtDto);
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating importation failed');
    }
  }

  @Get()
  @Permissions(['importation-read'])
  async findAll() {
    try {
      const importation = await this.importationsService.findAll();
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching importations failed');
    }
  }

  @Get(':id')
  @Permissions(['importation-read'])
  async findOne(@Param('id') id: string) {
    try {
      const importation = await this.importationsService.findOne(+id);
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching importation failed');
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
      console.error(error);
      throw new BadRequestException('Updating importation failed');
    }
  }

  @Delete(':id')
  @Permissions(['importation-delete'])
  async remove(@Param('id') id: string) {
    try {
      const importation = await this.importationsService.remove(+id);
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Removing importation failed');
    }
  }
}
