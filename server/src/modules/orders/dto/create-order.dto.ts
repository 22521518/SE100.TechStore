import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
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

  @IsEnum($Enums.PAYMENT_METHOD, { message: 'Invalid order method' })
  payment_method: $Enums.PAYMENT_METHOD;
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
