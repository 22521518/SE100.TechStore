import { IsNumber, IsString } from 'class-validator';

export class CreateShipDto {
  @IsString()
  order_id: string;

  // @IsString()
  @IsNumber()
  address_id: number;
}
