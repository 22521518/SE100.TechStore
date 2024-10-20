import { $Enums } from '@prisma/client';
import { IsDateString, IsEnum } from 'class-validator';

export class UpdateShipDto {
  @IsDateString()
  delivery_date: string | Date;

  @IsEnum($Enums.ORDER_STATUS, { message: 'Invalid order status' })
  shipping_status: $Enums.ORDER_STATUS;
}
