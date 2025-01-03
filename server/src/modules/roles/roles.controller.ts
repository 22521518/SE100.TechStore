import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Prisma } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { StaffDefaultPermissionsList } from '../../permissions/permissions.config';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(['role-create'])
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const { role_permissions, ...rest } = createRoleDto;
      const roleDto: Prisma.RolesCreateInput = {
        ...rest,
        ...(role_permissions && {
          role_permissions: {
            connect: [
              ...role_permissions.map((permission) => ({
                permission_id: permission.permission_id,
              })),
              ...StaffDefaultPermissionsList.map((permission) => ({
                permission_name: permission.permission_name,
              })),
            ],
          },
        }),
      };
      const role = await this.rolesService.create(roleDto);
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating role failed');
    }
  }

  @Get()
  @Permissions(['role-read'])
  async findAll(@Query('q') query: string) {
    try {
      const role = await this.rolesService.findAll(query);
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating role failed');
    }
  }

  @Get(':id')
  @Permissions(['role-read'])
  async findOne(@Param('id') id: string) {
    try {
      const role = await this.rolesService.findOne(+id);
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating role failed');
    }
  }

  @Patch(':id')
  @Permissions(['role-update'])
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const { role_permissions, ...rest } = updateRoleDto;
      const roleDto: Prisma.RolesUpdateInput = {
        ...rest,
        ...(role_permissions && {
          role_permissions: {
            set: role_permissions.map((permission) => ({
              permission_id: permission.permission_id,
            })),
          },
        }),
      };

      const role = await this.rolesService.update(+id, roleDto);
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating role failed');
    }
  }

  @Delete(':id')
  @Permissions(['role-delete'])
  async remove(@Param('id') id: string) {
    try {
      const role = await this.rolesService.remove(+id);
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating role failed');
    }
  }
}
