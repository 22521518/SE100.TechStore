import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
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
  @IsNumber()
  permission_id: number;
}
