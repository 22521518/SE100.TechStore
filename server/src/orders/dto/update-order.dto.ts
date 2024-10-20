import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum($Enums.ORDER_STATUS, { message: 'Invalid order status' })
  order_status: $Enums.ORDER_STATUS;
}
