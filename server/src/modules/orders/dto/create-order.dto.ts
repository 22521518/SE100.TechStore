import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  total_price: number;

  @IsString()
  @IsOptional()
  voucher_code?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItems)
  order_items: OrderItems[];
}

export class OrderItems {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_price: number;
}
