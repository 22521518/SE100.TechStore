import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';
import { Prisma } from '@prisma/client';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const permissionDto: Prisma.PermissionsCreateInput = {
        permission_name: createPermissionDto.permission_name,
        description: createPermissionDto.description,
      };

      const permission = await this.prismaDbService.permissions.create({
        data: permissionDto,
      });

      return permission;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating permission');
    }
  }

  async findAll() {
    try {
      const permissions = await this.prismaDbService.permissions.findMany();
      return [
        ...permissions,
        ...[
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ].map(
          (i) =>
            new Permission(
              'permision_id' +
                i +
                `${Math.random() % (i + Math.random() * 1000)}`,
            ),
        ),
      ];
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching permissions');
    }
  }

  async findOne(id: string) {
    try {
      const permission = await this.prismaDbService.permissions.findUnique({
        where: {
          permission_id: id,
        },
      });

      return permission;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching permission');
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permissionDto: Prisma.PermissionsUpdateInput = {
        ...updatePermissionDto,
      };
      const permission = await this.prismaDbService.permissions.update({
        where: {
          permission_id: id,
        },
        data: permissionDto,
      });

      return permission;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating permission');
    }
  }

  async remove(id: string) {
    try {
      const permission = await this.prismaDbService.permissions.delete({
        where: {
          permission_id: id,
        },
      });
      return permission;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting permission');
    }
  }
}
