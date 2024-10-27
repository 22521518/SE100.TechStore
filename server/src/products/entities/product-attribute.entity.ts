import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';

@Schema({
  timestamps: true,
})
export class ProductAttribute {
  @Prop()
  @IsOptional()
  @IsString()
  product_id?: string;

  @Prop()
  @IsString()
  name: string;

  @Prop()
  @IsString()
  detail: string;
}

export const ProductAttributeSchema =
  SchemaFactory.createForClass(ProductAttribute);
