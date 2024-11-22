import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAccountsDto } from 'src/modules/accounts/dto/create-accounts.dto';
import { ImageDto } from 'src/modules/common-dto/ImageDto';

export class CreateCustomerDto {
  @IsString()
  username: string;

  @IsString()
  full_name: string;

  @IsString()
  @Length(10, 10)
  phone_number: string;

  @ValidateNested()
  @Type(() => CreateAccountsDto)
  account: CreateAccountsDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  image?: ImageDto;

  @IsBoolean()
  male: boolean;

  @IsDateString()
  birth_date: Date | string;
}
