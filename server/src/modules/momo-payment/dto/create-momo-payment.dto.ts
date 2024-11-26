import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';

export class CreateMomoPaymentDto extends CreateOrderDto {
  redirectUrl: string;
}
