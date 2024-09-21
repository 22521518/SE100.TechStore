import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class SupplierService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createSupplierDto: Prisma.SuppliersCreateInput) {
    try {
      const supplier = await this.prismaDbService.suppliers.create({
        data: createSupplierDto,
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const suppliers = await this.prismaDbService.suppliers.findMany();
      return suppliers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number) {
    try {
      const supplier = await this.prismaDbService.suppliers.findUnique({
        where: { supplier_id: id },
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async update(id: number, updateSupplierDto: Prisma.SuppliersUpdateInput) {
    try {
      const supplier = await this.prismaDbService.suppliers.update({
        where: { supplier_id: id },
        data: updateSupplierDto,
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    try {
      const supplier = await this.prismaDbService.suppliers.delete({
        where: { supplier_id: id },
      });
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }
}
