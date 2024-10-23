import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Category } from './create-products.dto';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  product_name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  images?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories?: Category[];

  @IsOptional()
  @IsArray()
  attributes?: any[];
}
