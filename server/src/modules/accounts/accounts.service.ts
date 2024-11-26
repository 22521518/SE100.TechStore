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
    } catch {
      throw new BadRequestException('Error creating account');
    }
  }

  async comparePassword(password: string, hash: string) {
    try {
      return password === hash;
    } catch {
      throw new BadRequestException('Error comparing password');
    }
  }

  async findOneByEmail(email: string) {
    try {
      const acc = await this.prismaDbService.accounts.findUnique({
        where: { email: email },
      });
      return acc;
    } catch {
      throw new BadRequestException('Error fetching account');
    }
  }

  async findAll(contain_email: string) {
    try {
      const acc = await this.prismaDbService.accounts.findMany({
        where: {
          ...(contain_email ? { email: { contains: contain_email } } : {}),
        },
      });
      return acc;
    } catch {
      throw new BadRequestException('Error fetching accounts');
    }
  }

  async findOne(id: string) {
    try {
      const acc = await this.prismaDbService.accounts.findUnique({
        where: { account_id: id },
      });
      return acc;
    } catch {
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
    } catch {
      throw new BadRequestException('Error updating account');
    }
  }

  async remove(id: string) {
    try {
      const acc = await this.prismaDbService.accounts.delete({
        where: { account_id: id },
      });
      return acc;
    } catch {
      throw new BadRequestException('Error deleting account');
    }
  }
}
