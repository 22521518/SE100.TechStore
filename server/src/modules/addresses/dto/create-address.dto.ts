import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  ward: string;

  @IsString()
  full_name: string;

  @IsString()
  @Length(10, 10)
  phone_number: string;

  @IsOptional()
  @IsBoolean()
  is_primary: boolean;
}
