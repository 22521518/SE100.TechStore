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
import { Category } from './create-products.dto';
import { ImageDto } from '../../../dto/ImageDto';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  product_id?: string;

  @IsString()
  product_name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

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
