import { IsString } from 'class-validator';

export class CreateCategoriesDto {
  @IsString()
  category_name: string;

  @IsString()
  description: string;
}
