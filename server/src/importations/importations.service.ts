import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class ImportationsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(
    createImportationDto: Prisma.ImportationsCreateInput,
    including_item: boolean = true,
    including_supplier: boolean = true,
  ) {
    const { import_items, ...imprt } = createImportationDto;
    if (
      !import_items ||
      (import_items as Prisma.Import_ItemsCreateInput[]).length === 0
    ) {
      throw new BadRequestException(
        'There is no import_items provided for the importation',
      );
    }
    try {
      // Create the importation along with the nested import_items if provided
      const importation = await this.prismaDbService.importations.create({
        data: {
          ...imprt,
          import_items: {
            createMany: {
              data: import_items as Prisma.Import_ItemsCreateInput[],
            },
          },
        },
        include: { import_items: including_item, supplier: including_supplier },
      });

      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating importation');
    }
  }

  async findAll(
    including_item: boolean = true,
    including_supplier: boolean = true,
  ) {
    try {
      const importations = await this.prismaDbService.importations.findMany({
        include: { import_items: including_item, supplier: including_supplier },
      });
      return importations;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching all importations');
    }
  }

  async findOne(
    id: number,
    including_item: boolean = true,
    including_supplier: boolean = true,
  ) {
    try {
      const importation = await this.prismaDbService.importations.findUnique({
        where: { importation_id: id },
        include: { import_items: including_item, supplier: including_supplier },
      });
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching importation');
    }
  }

  async update(
    id: number,
    updateImportationDto: Prisma.ImportationsUpdateInput,
    including_item: boolean = true,
    including_supplier: boolean = true,
  ) {
    try {
      const importation = await this.prismaDbService.importations.update({
        where: { importation_id: id },
        data: updateImportationDto,
        include: { import_items: including_item, supplier: including_supplier },
      });
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating importation');
    }
  }

  async remove(
    id: number,
    including_item: boolean = true,
    including_supplier: boolean = true,
  ) {
    try {
      const importation = await this.prismaDbService.importations.delete({
        where: { importation_id: id },
        include: { import_items: including_item, supplier: including_supplier },
      });
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting importation');
    }
  }
}
