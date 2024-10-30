import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createCustomerDto: Prisma.CustomersCreateInput) {
    try {
      const customer = await this.prismaDbService.customers.create({
        data: createCustomerDto,
      });
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating customer');
    }
  }

  async findAll() {
    try {
      const customers = await this.prismaDbService.customers.findMany({
        include: {
          account: true,
        },
      });
      const customersWithAccount = customers.map((customer) => {
        const { account, ...rest } = customer;
        return {
          ...rest,
          account: {
            email: account.email,
          },
        };
      });
      return customersWithAccount;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching customer');
    }
  }

  async findOne(id: string) {
    try {
      const customer = await this.prismaDbService.customers.findUnique({
        where: { customer_id: id },
        include: {
          orders: true,
          product_feedbacks: true,
          account: true,
          addresses: true,
        },
      });
      const { account, ...rest } = customer;
      return {
        ...rest,
        account: {
          email: account.email,
        },
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching customer');
    }
  }

  async update(id: string, updateCustomerDto: Prisma.CustomersUpdateInput) {
    try {
      const customer = await this.prismaDbService.customers.update({
        where: { customer_id: id },
        data: updateCustomerDto,
      });

      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating customer');
    }
  }

  async remove(id: string) {
    try {
      const customer = await this.prismaDbService.customers.delete({
        where: { customer_id: id },
      });
      return customer;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting customer');
    }
  }
}
