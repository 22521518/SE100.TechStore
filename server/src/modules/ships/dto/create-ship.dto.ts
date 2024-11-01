import { IsString } from 'class-validator';

export class CreateShipDto {
  @IsString()
  order_id: string;

  @IsString()
  address_id: string;
}
