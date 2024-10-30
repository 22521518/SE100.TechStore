import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createAccountDto: Prisma.AccountsCreateInput) {
    try {
      const acc = await this.prismaDbService.accounts.create({
        data: createAccountDto,
      });
      return acc;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating account');
    }
  }

  async findAll() {
    try {
      const acc = await this.prismaDbService.accounts.findMany();
      return acc;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error fetching accounts');
    }
  }

  async findOne(id: string) {
    try {
      const acc = await this.prismaDbService.accounts.findUnique({
        where: { account_id: id },
      });
      return acc;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error fetching account');
    }
  }

  async update(id: string, updateAccountDto: Prisma.AccountsUpdateInput) {
    try {
      const acc = await this.prismaDbService.accounts.update({
        where: { account_id: id },
        data: updateAccountDto,
      });
      return acc;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error updating account');
    }
  }

  async remove(id: string) {
    try {
      const acc = await this.prismaDbService.accounts.delete({
        where: { account_id: id },
      });
      return acc;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error deleting account');
    }
  }
}
