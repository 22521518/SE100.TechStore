import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CloudinaryDbService } from 'src/databases/cloudinary-db/cloudinary-db.service';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class StaffService {
  constructor(
    private readonly prismaDbService: PrismaDbService,
    private readonly cloudinaryDbService: CloudinaryDbService,
  ) {}
  async create(
    createStaffDto: Prisma.StaffCreateInput,
    image: Express.Multer.File | null,
  ) {
    try {
      let imageAvatarUrl = null;
      if (image) {
        imageAvatarUrl = await this.cloudinaryDbService.upload(image, 'staff');
        createStaffDto.image = imageAvatarUrl;
      }

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

  async findAll(
    query: string,
    full_name: string,
    staff_id: string,
    email: string,
  ) {
    try {
      const staff = await this.prismaDbService.staff.findMany({
        where: {
          OR: [
            {
              full_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              staff_id: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              account: {
                email: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          ],
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

  async update(
    id: string,
    updateStaffDto: Prisma.StaffUpdateInput,
    image: Express.Multer.File | null,
  ) {
    try {
      let imageAvatarUrl = null;
      if (image) {
        imageAvatarUrl = await this.cloudinaryDbService.upload(image, 'staff');
        updateStaffDto.image = imageAvatarUrl;
      }

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
