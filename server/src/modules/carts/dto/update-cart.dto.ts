import { IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateCartDto {
  @IsString()
  product_id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
