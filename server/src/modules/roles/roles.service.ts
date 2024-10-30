import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';

@Injectable()
export class RolesService {
  constructor(private readonly prismaDbService: PrismaDbService) {}

  async create(
    createRoleDto: Prisma.RolesCreateInput,
    including_permissions: boolean = true,
  ) {
    try {
      const role = await this.prismaDbService.roles.create({
        data: createRoleDto,
        include: {
          role_permissions: including_permissions,
        },
      });
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating role');
    }
  }

  async findAll(including_permissions: boolean = true) {
    try {
      const roles = await this.prismaDbService.roles.findMany({
        include: {
          role_permissions: including_permissions,
        },
      });
      return roles;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching role');
    }
  }

  async findOne(id: number, including_permissions: boolean = true) {
    try {
      const role = await this.prismaDbService.roles.findUnique({
        where: {
          role_id: id,
        },
        include: {
          role_permissions: including_permissions,
          staff: true,
        },
      });
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error fetching role');
    }
  }

  async update(
    id: number,
    updateRoleDto: Prisma.RolesUpdateInput,
    including_permissions: boolean = true,
  ) {
    try {
      const role = await this.prismaDbService.roles.update({
        where: {
          role_id: id,
        },
        data: updateRoleDto,
        include: {
          role_permissions: including_permissions,
        },
      });

      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating role');
    }
  }

  async remove(id: number, including_permissions: boolean = true) {
    try {
      const role = await this.prismaDbService.roles.delete({
        where: {
          role_id: id,
        },
        include: {
          role_permissions: including_permissions,
        },
      });
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting role');
    }
  }
}
