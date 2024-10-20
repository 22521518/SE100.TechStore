import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  product_id?: string;

  @IsString()
  product_name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  images?: string[];

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];

  @IsOptional()
  @IsArray()
  attributes?: any[];
}

export class Category {
  @IsNumber()
  category_id: number;
}
