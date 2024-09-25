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
import { CustomersService } from './customers.service';
import { Prisma } from '@prisma/client';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: Prisma.CustomersCreateInput) {
    try {
      const customer = await this.customersService.create(createCustomerDto);
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating customer failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const customer = await this.customersService.findAll();
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching customer failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const customer = await this.customersService.findOne(id);
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching customer failed');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: Prisma.CustomersUpdateInput,
  ) {
    try {
      const customer = await this.customersService.update(
        id,
        updateCustomerDto,
      );
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating customer failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const customer = await this.customersService.remove(id);
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleing customer failed');
    }
  }
}
