import { Global, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionInit } from './permission-init.service';

@Global()
@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionInit],
  exports: [PermissionsService],
})
export class PermissionsModule {}
