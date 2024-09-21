import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class ImportationsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  create(createImportationDto: Prisma.ImportationsCreateInput) {
    try {
      const importation = this.prismaDbService.importations.create({
        data: createImportationDto,
      });
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  findAll() {
    try {
      const importations = this.prismaDbService.importations.findMany();
      return importations;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  findOne(id: number) {
    try {
      const importation = this.prismaDbService.importations.findUnique({
        where: { importation_id: id },
      });
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  update(id: number, updateImportationDto: Prisma.ImportationsUpdateInput) {
    try {
      const importation = this.prismaDbService.importations.update({
        where: { importation_id: id },
        data: updateImportationDto,
      });
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  remove(id: number) {
    try {
      const importation = this.prismaDbService.importations.delete({
        where: { importation_id: id },
      });
      return importation;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }
}
