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

  async findAll(contain_username: string, contain_customer_id: string) {
    try {
      const customers = await this.prismaDbService.customers.findMany({
        where: {
          ...(contain_username
            ? {
                username: {
                  contains: contain_username,
                },
              }
            : {}),
          ...(contain_customer_id
            ? {
                customer_id: {
                  contains: contain_customer_id,
                },
              }
            : {}),
        },
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

  async findOneByAccount(account_id: string) {
    try {
      const customer = await this.prismaDbService.customers.findFirst({
        where: {
          account_id: account_id,
        },
        include: {
          account: true,
        },
      });
      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
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

  async findOneByEmail(email: string) {
    try {
      const customer = await this.prismaDbService.customers.findFirst({
        where: {
          account: {
            email: email,
          },
        },
        include: {
          account: true,
        },
      });
      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
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

  async findOne(
    customer_id: string,
    including_product_feedbacks: boolean = true,
    including_orders: boolean = true,
    including_addresses: boolean = true,
    including_account: boolean = true,
  ) {
    try {
      const customer = await this.prismaDbService.customers.findUnique({
        where: { customer_id: customer_id },
        include: {
          orders: including_orders,
          product_feedbacks: including_product_feedbacks,
          account: {
            select: including_account
              ? {
                  email: true,
                }
              : undefined,
          },
          addresses: including_addresses,
        },
      });
      return customer;
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
