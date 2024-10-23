import { $Enums } from '@prisma/client';
import { IsDateString, IsEnum, IsString, Length } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  account_id: string;

  @IsString()
  full_name: string;

  @IsString()
  @Length(10, 10)
  phone_number: string;

  @IsEnum($Enums.EMPLOY_STATUS, { message: 'Invalid employee status' })
  employee_status?: $Enums.EMPLOY_STATUS;

  @IsDateString()
  hire_date: Date | string;
}
