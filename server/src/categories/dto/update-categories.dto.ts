import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoriesDto {
  @IsString()
  @IsOptional()
  category_name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
