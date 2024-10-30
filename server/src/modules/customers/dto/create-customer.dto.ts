import { IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAccountsDto } from 'src/modules/accounts/dto/create-accounts.dto';

export class CreateCustomerDto {
  @IsString()
  username: string;

  @IsString()
  full_name: string;

  @IsString()
  @Length(10, 10)
  phone_number: string;

  @ValidateNested()
  @Type(() => CreateAccountsDto)
  account: CreateAccountsDto;
}
