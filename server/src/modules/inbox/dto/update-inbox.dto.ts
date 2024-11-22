import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { CreateInboxMessageDto, SenderDto } from './create-inbox.dto';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';

export class UpdateInboxDto {
  @IsString()
  room_id: string;

  @Type(() => SenderDto)
  cusomter: CreateCustomerDto;

  @Type(() => CreateInboxMessageDto)
  messages: CreateInboxMessageDto[];
}
