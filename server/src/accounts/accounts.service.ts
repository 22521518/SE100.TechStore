import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async reate(createAccountDto: Prisma.AccountsCreateInput) {
    return await this.prismaDbService.accounts.create({
      data: createAccountDto,
    });
  }

  async findAll() {
    return await this.prismaDbService.accounts.findMany();
  }

  async findOne(id: number) {
    return await this.prismaDbService.accounts.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateAccountDto: Prisma.AccountsUpdateInput) {
    return await this.prismaDbService.accounts.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  async remove(id: number) {
    return await this.prismaDbService.accounts.delete({
      where: { id },
    });
  }
}
