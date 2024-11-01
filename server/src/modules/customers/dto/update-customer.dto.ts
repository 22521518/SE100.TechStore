import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  phone_number?: string;
}
