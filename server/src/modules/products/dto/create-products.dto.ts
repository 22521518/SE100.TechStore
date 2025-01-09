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
import { ImageDto } from '../../../dto/ImageDto';

export class CreateProductDto {
  @IsString()
  product_name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

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
