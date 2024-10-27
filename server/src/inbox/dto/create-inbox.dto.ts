import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateCustomerDto } from 'src/customers/dto/create-customer.dto';

export class SenderDto {
  @IsString()
  sender_id: string;

  @IsString()
  sender_name: string;
}

export class CreateInboxMessageDto {
  @ValidateNested()
  @Type(() => SenderDto)
  sender: SenderDto;

  @IsString()
  message: string;

  @IsBoolean()
  @IsOptional()
  is_seen?: boolean;

  @IsDateString()
  @IsOptional()
  created_at?: Date | string;
}

export class CreateInboxRoomDto {
  @IsString()
  room_id?: string;

  @Type(() => SenderDto)
  cusomter: CreateCustomerDto;

  @Type(() => CreateInboxMessageDto)
  messages: CreateInboxMessageDto[];
}
