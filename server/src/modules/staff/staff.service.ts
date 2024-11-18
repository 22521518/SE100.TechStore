import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class StaffService {
  constructor(private readonly prismaDbService: PrismaDbService) {}
  async create(createStaffDto: Prisma.StaffCreateInput) {
    try {
      const staff = await this.prismaDbService.staff.create({
        data: createStaffDto,
        include: {
          role: true,
        },
      });
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating staff');
    }
  }

  async findAll(full_name: string, staff_id: string, email: string) {
    try {
      const staff = await this.prismaDbService.staff.findMany({
        where: {
          ...(full_name
            ? {
                full_name: {
                  contains: full_name,
                  mode: 'insensitive',
                },
              }
            : {}),
          ...(staff_id
            ? {
                staff_id: {
                  equals: staff_id,
                },
              }
            : {}),
          ...(email
            ? {
                account: {
                  email: {
                    contains: email,
                    mode: 'insensitive',
                  },
                },
              }
            : {}),
        },
        include: {
          role: true,
          account: true,
        },
      });
      const staffs = staff.map((acc) => {
        if (!acc) return null;
        const { account, ...rest } = acc;
        return {
          ...rest,
          account: {
            email: account.email,
          },
        };
      });
      return staffs;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching staff');
    }
  }

  async findOneByAccount(account_id: string) {
    try {
      const staff = await this.prismaDbService.staff.findFirst({
        where: {
          account_id,
        },
        include: {
          role: true,
          account: true,
        },
      });
      if (!staff) return null;
      const { account, ...rest } = staff;
      return {
        ...rest,
        account: {
          email: account.email,
        },
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching staff');
    }
  }

  async findOne(id: string) {
    try {
      const staff = await this.prismaDbService.staff.findUnique({
        where: { staff_id: id },
        include: {
          role: true,
          account: true,
        },
      });
      if (!staff) return null;
      const { account, ...rest } = staff;
      return {
        ...rest,
        account: {
          email: account.email,
        },
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching staff');
    }
  }

  async update(id: string, updateStaffDto: Prisma.StaffUpdateInput) {
    try {
      const staff = await this.prismaDbService.staff.update({
        where: { staff_id: id },
        data: updateStaffDto,
        include: {
          role: true,
        },
      });

      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating staff');
    }
  }

  async remove(id: string) {
    try {
      const staff = await this.prismaDbService.staff.delete({
        where: { staff_id: id },
        include: {
          role: true,
        },
      });
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting staff');
    }
  }
}
