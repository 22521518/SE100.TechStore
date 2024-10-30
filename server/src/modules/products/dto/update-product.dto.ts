import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductAttribute } from '../entities/product-attribute.entity';
import { Category, ProductImageDto } from './create-products.dto';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  product_id?: string;

  @IsString()
  product_name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock_quantity?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories?: Category[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  attributes?: ProductAttribute[];
}
