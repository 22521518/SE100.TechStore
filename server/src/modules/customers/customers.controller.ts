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
import { CustomersService } from './customers.service';
import { Prisma } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly prismaDbService: PrismaDbService,
  ) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const { account, ...customerInfo } = createCustomerDto;

      const existingAccount = await this.prismaDbService.accounts.findUnique({
        where: { email: account.email },
      });

      if (existingAccount) {
        throw new BadRequestException('Email already exists');
      }

      const customerDto: Prisma.CustomersCreateInput = {
        ...customerInfo,
        account: {
          connectOrCreate: {
            where: { email: account.email }, // Ensure to use the same unique identifier
            create: {
              email: account.email,
              password: account.password, // Adjust as necessary
              // Add other necessary fields here...
            },
          },
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
  async findAll(
    @Query('username') contain_username: string,
    @Query('customer_id') contain_customer_id: string,
  ) {
    try {
      const customer = await this.customersService.findAll(
        contain_username,
        contain_customer_id,
      );
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
