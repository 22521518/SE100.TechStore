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
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customerDto: Prisma.CustomersCreateInput = {
        ...createCustomerDto,
        account: {
          create: createCustomerDto.account,
          connectOrCreate: {
            where: createCustomerDto.account,
            create: createCustomerDto.account,
          },
          connect: createCustomerDto.account,
        },
      };
      const customer = await this.customersService.create(customerDto);
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
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const customerDto: Prisma.CustomersUpdateInput = {
        ...updateCustomerDto,
      };
      const customer = await this.customersService.update(id, customerDto);
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
