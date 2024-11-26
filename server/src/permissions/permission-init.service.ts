import { Injectable, OnModuleInit } from '@nestjs/common';
import { PermissionsList } from 'src/permissions/permissions.config';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionInit implements OnModuleInit {
  constructor(private permissionsService: PermissionsService) {}
  async onModuleInit() {
    for (const permission of PermissionsList) {
      const existingPermission =
        await this.permissionsService.findByPermissionName(
          permission.permission_name,
        );

      if (!existingPermission) {
        // Create the permission if it doesn't exist
        await this.permissionsService.create({
          permission_name: permission.permission_name,
          description: permission.description,
        });
      }
    }
  }
}
