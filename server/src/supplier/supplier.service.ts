import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class SupplierService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(
    createSupplierDto: Prisma.SuppliersCreateInput,
    including_importations: boolean = true,
  ) {
    try {
      const supplier = await this.prismaDbService.suppliers.create({
        data: createSupplierDto,
        include: { importations: including_importations },
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating supplier failed');
    }
  }

  async findAll(including_importations: boolean = true) {
    try {
      const suppliers = await this.prismaDbService.suppliers.findMany({
        include: { importations: including_importations },
      });
      return suppliers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching suppliers failed');
    }
  }

  async findOne(id: number, including_importations: boolean = true) {
    try {
      const supplier = await this.prismaDbService.suppliers.findUnique({
        where: { supplier_id: id },
        include: { importations: including_importations },
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching supplier failed');
    }
  }

  async update(
    id: number,
    updateSupplierDto: Prisma.SuppliersUpdateInput,
    including_importations: boolean = true,
  ) {
    try {
      const supplier = await this.prismaDbService.suppliers.update({
        where: { supplier_id: id },
        data: updateSupplierDto,
        include: { importations: including_importations },
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating supplier failed');
    }
  }

  async remove(id: number, including_importations: boolean = true) {
    try {
      const supplier = await this.prismaDbService.suppliers.delete({
        where: { supplier_id: id },
        include: { importations: including_importations },
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting supplier failed');
    }
  }

  async removeAll() {
    try {
      const suppliers = await this.prismaDbService.suppliers.deleteMany();
      return suppliers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting all suppliers failed');
    }
  }
}
