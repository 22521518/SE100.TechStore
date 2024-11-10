import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  product_id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  customer_id: string;
}
