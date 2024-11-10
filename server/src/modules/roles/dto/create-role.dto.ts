import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @IsString()
  role_name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolePermission)
  role_permissions?: RolePermission[];
}

export class RolePermission {
  @IsString()
  permission_id: string;
}
