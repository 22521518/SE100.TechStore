import { IsString, Length } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  supplier_name: string;

  @IsString()
  @Length(10, 10)
  contact_number: string;

  @IsString()
  email: string;

  @IsString()
  description: string;
}
