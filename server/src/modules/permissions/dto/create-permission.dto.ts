import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsOptional()
  @IsString()
  permission_id?: string;

  @IsString()
  permission_name: string;

  @IsString()
  description: string;
}
