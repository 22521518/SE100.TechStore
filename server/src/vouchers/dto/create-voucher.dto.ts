import { IsDateString, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateVoucherDto {
  @IsString()
  voucher_name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount_amount: number;

  @IsDateString()
  valid_from: Date | string;

  @IsDateString()
  valid_to: Date | string;
}
