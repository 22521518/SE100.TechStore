import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  product_id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  customer_id: string;
}
