import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateStaffRoleDto {
  @IsNumber()
  role_id: number;
}

export class UpdateStaffDto {
  @IsOptional()
  @Type(() => UpdateStaffDto)
  role?: UpdateStaffRoleDto;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsEnum($Enums.EMPLOY_STATUS, { message: 'Invalid employee status' })
  @IsOptional()
  employee_status?: $Enums.EMPLOY_STATUS;

  @IsDateString()
  @IsOptional()
  birth_date: Date | string;

  @IsBoolean()
  @IsOptional()
  male: boolean;
}
