import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

@Injectable()
export class VouchersService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  create(createVoucherDto: Prisma.VouchersCreateInput) {
    try {
      const voucher = this.prismaDbService.vouchers.create({
        data: createVoucherDto,
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating voucher');
    }
  }

  findAll() {
    try {
      const vouchers = this.prismaDbService.vouchers.findMany();
      return vouchers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching vouchers');
    }
  }

  findOne(id: string) {
    try {
      const voucher = this.prismaDbService.vouchers.findUnique({
        where: { voucher_code: id },
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching voucher');
    }
  }

  update(id: string, updateVoucherDto: Prisma.VouchersUpdateInput) {
    try {
      const voucher = this.prismaDbService.vouchers.update({
        where: { voucher_code: id },
        data: updateVoucherDto,
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating voucher');
    }
  }

  remove(id: string) {
    try {
      const voucher = this.prismaDbService.vouchers.delete({
        where: { voucher_code: id },
      });
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting voucher');
    }
  }
}
