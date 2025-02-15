import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ImageDto } from 'src/dto/ImageDto';
import { CreateAccountsDto } from 'src/modules/accounts/dto/create-accounts.dto';

export class CreateStaffDto {
  @ValidateNested()
  @Type(() => CreateAccountsDto)
  account: CreateAccountsDto;

  @IsString()
  full_name: string;

  @IsString()
  @Length(10, 10)
  phone_number: string;

  @IsOptional()
  @IsEnum($Enums.EMPLOY_STATUS, { message: 'Invalid employee status' })
  employee_status?: $Enums.EMPLOY_STATUS;

  @IsDateString()
  hire_date: Date | string;

  @IsDateString()
  birth_date: Date | string;

  @IsBoolean()
  male: boolean;

  @IsOptional()
  @Type(() => ImageDto)
  image?: ImageDto;
}
