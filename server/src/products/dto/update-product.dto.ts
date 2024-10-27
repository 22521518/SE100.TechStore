import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Category } from './create-products.dto';
import { Type } from 'class-transformer';
import { ProductAttribute } from '../entities/product-attribute.entity';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  product_name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  images?: Express.Multer.File[];

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
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  attributes?: ProductAttribute[];
}
