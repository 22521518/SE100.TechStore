import { $Enums } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class UpdateStaffDto {
  @IsNumber()
  role_id?: number;

  @IsString()
  full_name?: string;

  @IsString()
  phone_number?: string;

  @IsEnum($Enums.EMPLOY_STATUS, { message: 'Invalid employee status' })
  employee_status?: $Enums.EMPLOY_STATUS;
}
