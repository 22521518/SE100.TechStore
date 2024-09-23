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
import { SupplierService } from './supplier.service';
import { Prisma } from '@prisma/client';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async create(@Body() createSupplierDto: Prisma.SuppliersCreateInput) {
    try {
      const supplier = await this.supplierService.create(createSupplierDto);
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating supplier failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const suppliers = await this.supplierService.findAll();
      return suppliers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching supplier failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const supplier = await this.supplierService.findOne(+id);
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching supplier failed');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: Prisma.SuppliersUpdateInput,
  ) {
    try {
      const supplier = await this.supplierService.update(
        +id,
        updateSupplierDto,
      );
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating supplier failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const supplier = await this.supplierService.remove(+id);
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting supplier failed');
    }
  }
}
