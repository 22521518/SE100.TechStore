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
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    try {
      const supplierDto: Prisma.SuppliersCreateInput = {
        ...createSupplierDto,
      };

      const supplier = await this.supplierService.create(supplierDto);
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
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    try {
      const supplierDto: Prisma.SuppliersUpdateInput = {
        ...updateSupplierDto,
      };
      const supplier = await this.supplierService.update(+id, supplierDto);
      return supplier;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating supplier failed');
    }
  }

  //DEV mode
  @Delete('all')
  async removeAll() {
    try {
      const suppliers = await this.supplierService.removeAll();
      return suppliers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting suppliers failed');
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
