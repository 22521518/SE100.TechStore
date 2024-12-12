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
import { SupplierService } from './supplier.service';
import { Prisma } from '@prisma/client';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Permissions(['supplier-create'])
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
  @Permissions(['supplier-read'])
  async findAll(@Query('q') query: string) {
    try {
      const suppliers = await this.supplierService.findAll(query);
      return suppliers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching supplier failed');
    }
  }

  @Get(':id')
  @Permissions(['supplier-read'])
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
  @Permissions(['supplier-update'])
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
  @Permissions(['supplier-delete'])
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
  @Permissions(['supplier-delete'])
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
