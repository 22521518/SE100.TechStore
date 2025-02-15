import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';
import { Prisma } from '@prisma/client';
import { CustomerDefaultPermissionsList } from './permissions.config';

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

  async findByRole(roleId: number) {
    try {
      if (roleId === 0) {
        return CustomerDefaultPermissionsList;
      }

      const permissions = await this.prismaDbService.permissions.findMany({
        where: {
          role_permissions: {
            some: {
              role_id: roleId,
            },
          },
        },
      });
      return permissions;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching permissions');
    }
  }

  async findAll() {
    try {
      const permissions = await this.prismaDbService.permissions.findMany();
      return [...permissions];
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching permissions');
    }
  }

  async findByPermissionName(permissionName: string) {
    try {
      const permission = await this.prismaDbService.permissions.findUnique({
        where: {
          permission_name: permissionName,
        },
      });

      return permission;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching permission');
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

  async removeAll() {
    try {
      const permissions = await this.prismaDbService.permissions.deleteMany();
      return permissions;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting permissions');
    }
  }
}
