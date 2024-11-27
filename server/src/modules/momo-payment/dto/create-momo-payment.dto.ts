import { IsString } from 'class-validator';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';

export class CreateMomoPaymentDto extends CreateOrderDto {
  @IsString()
  redirectUrl: string;
}
