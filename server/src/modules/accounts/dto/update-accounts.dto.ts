import { IsOptional, IsString } from 'class-validator';

export class UpdateAccountsDto {
  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  password?: string;

  @IsOptional()
  is_active?: boolean;
}
