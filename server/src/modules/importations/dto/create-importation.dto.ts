import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImportationDto {
  @IsNumber()
  supplier_id: number;

  @IsOptional()
  @IsNumber()
  total_price?: number;

  @IsOptional()
  @IsString()
  remarks?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportItems)
  import_items: ImportItems[];
}

export class ImportItems {
  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_price: number;
}
