import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsPositive()
  quantity: number;
}
