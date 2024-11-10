import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerInboxDto } from './create-customer-inbox.dto';

export class UpdateCustomerInboxDto extends PartialType(CreateCustomerInboxDto) {}
