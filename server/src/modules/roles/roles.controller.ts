import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Prisma } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const roleDto: Prisma.RolesCreateInput = {
        role_name: createRoleDto.role_name,
        description: createRoleDto.description,
      };
      const role = await this.rolesService.create(roleDto);
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating role failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const role = await this.rolesService.findAll();
      return role;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating role failed');
    }
  }

  @Get(':id')
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
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      const { role_permissions, role_name, description } = updateRoleDto;
      const roleDto: Prisma.RolesUpdateInput = {
        role_name,
        description,
        ...(role_permissions && {
          role_permissions: {
            set: role_permissions,
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
