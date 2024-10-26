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
import { ProductAttribute } from '../schemas/product-attribute.schema';

export class CreateProductDto {
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

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock_quantity?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttribute)
  attributes?: ProductAttribute[];
}

export class Category {
  @IsNumber()
  category_id: number;
}

export class ProductImageDto {
  @IsString()
  name: string;

  @IsString()
  url: string;
}
