import { IsOptional, IsString } from 'class-validator';

export class UpdateImportationDto {
  @IsOptional()
  @IsString()
  remarks?: string | null;
}
