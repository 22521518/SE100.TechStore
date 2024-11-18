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
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly prismaDbService: PrismaDbService,
  ) {}

  @Post()
  @Permissions(['customer-create'])
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const { account, image, ...customerInfo } = createCustomerDto;
      console.log('customer image', image);

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
            where: { email: account.email },
            create: {
              email: account.email,
              password: account.password,
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
  @Permissions(['customer-read'])
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
  @Permissions(['customer-read'])
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
  @Permissions(['customer-update'])
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const { image, ...customerInfo } = updateCustomerDto;
      console.log('customer update image', image);

      const customerDto: Prisma.CustomersUpdateInput = {
        ...customerInfo,
      };
      const customer = await this.customersService.update(id, customerDto);
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating customer failed');
    }
  }

  @Delete(':id')
  @Permissions(['customer-delete'])
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
