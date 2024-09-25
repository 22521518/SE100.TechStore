import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/prisma-db/prisma-db.service';

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

  async findAll() {
    try {
      const staff = await this.prismaDbService.staff.findMany({
        include: {
          role: true,
        },
      });
      return staff;
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
        },
      });
      return staff;
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
