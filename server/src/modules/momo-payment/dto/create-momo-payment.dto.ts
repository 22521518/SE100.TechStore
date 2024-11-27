import { IsOptional, IsString } from 'class-validator';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';

export class CreateMomoPaymentDto extends CreateOrderDto {
  @IsOptional()
  @IsString()
  redirectUrl?: string;
}
