import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '../decorators/permissions.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import {
  // GlobalPermissionsList,
  PermissionsList,
} from 'src/permissions/permissions.config';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private permissionService: PermissionsService,
  ) {}

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, context.getHandler());
    if (!permissions) {
      return true;
    }

    for (const permission of permissions) {
      // if (GlobalPermissionsList.some((p) => p.permission_name === permission)) {
      if (PermissionsList.some((p) => p.permission_name === permission)) {
        return true;
      }
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    let user;
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request['user'] = payload;
      user = payload;
    } catch {
      throw new UnauthorizedException('Token is outdated! Please login again');
    }

    if (!user) {
      throw new UnauthorizedException('User not found! Please login again');
    }

    const userPermissions = await this.permissionService
      .findByRole(user.role.role_id)
      .then((permissions) => permissions.map((p) => p.permission_name));

    if (!this.matchRoles(permissions, userPermissions)) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }

  matchRoles(permissions: string[], userPermissions: string[]) {
    return permissions.some((role) => userPermissions.includes(role));
  }
}
