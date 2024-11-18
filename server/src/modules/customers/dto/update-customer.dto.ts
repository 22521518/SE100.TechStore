import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ImageDto } from 'src/dto/ImageDto';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  phone_number?: string;

  @IsOptional()
  @Type(() => ImageDto)
  image?: ImageDto;

  @IsOptional()
  @IsBoolean()
  male?: boolean;

  @IsOptional()
  @IsDateString()
  birth_date?: Date | string;
}
