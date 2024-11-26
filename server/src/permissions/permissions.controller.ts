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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { StaffDefaultPermissionsList } from './permissions.config';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    throw new BadRequestException('You are not allowed to create permissions');
    return await this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Permissions(['role-create', 'role-read', 'role-update'])
  async findAll() {
    try {
      const permissions = await this.permissionsService.findAll();
      return permissions.filter(
        (p) =>
          !StaffDefaultPermissionsList.some(
            (per) => per.permission_name === p.permission_name,
          ),
      );
    } catch {
      throw new BadRequestException('Fetching role failed');
    }
  }

  @Get(':id')
  @Permissions(['role-create', 'role-read', 'role-update'])
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(['role-create', 'role-read', 'role-update'])
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete('/removeAll')
  @Permissions(['admin-permision'])
  async removeAll() {
    return await this.permissionsService.removeAll();
  }

  @Delete(':id')
  @Permissions(['admin-permision'])
  async remove(@Param('id') id: string) {
    return await this.permissionsService.remove(id);
  }
}
