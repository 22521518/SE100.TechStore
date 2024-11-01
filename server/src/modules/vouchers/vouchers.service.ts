import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class VouchersService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createVoucherDto: Prisma.VouchersCreateInput) {
    try {
      const voucher = await this.prismaDbService.vouchers.create({
        data: createVoucherDto,
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating voucher');
    }
  }

  async findAll(voucher_code: string, voucher_name: string) {
    try {
      const vouchers = await this.prismaDbService.vouchers.findMany({
        where: {
          ...(voucher_code
            ? {
                voucher_code: {
                  contains: voucher_code,
                  mode: 'insensitive',
                },
              }
            : {}),
          ...(voucher_name
            ? {
                voucher_name: {
                  contains: voucher_name,
                  mode: 'insensitive',
                },
              }
            : {}),
        },
      });
      return vouchers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching vouchers');
    }
  }

  async findOne(id: string) {
    try {
      const voucher = await this.prismaDbService.vouchers.findUnique({
        where: { voucher_code: id },
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching voucher');
    }
  }

  async update(id: string, updateVoucherDto: Prisma.VouchersUpdateInput) {
    try {
      const voucher = await this.prismaDbService.vouchers.update({
        where: { voucher_code: id },
        data: updateVoucherDto,
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating voucher');
    }
  }

  async remove(id: string) {
    try {
      const voucher = await this.prismaDbService.vouchers.delete({
        where: { voucher_code: id },
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting voucher');
    }
  }
}
