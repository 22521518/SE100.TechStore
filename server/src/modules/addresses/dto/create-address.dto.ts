import { IsString, Max, Min } from 'class-validator';

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
  @Min(10)
  @Max(10)
  phone_number: string;
}
