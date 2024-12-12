import { PartialType } from '@nestjs/mapped-types';
import { CreateMomoPaymentDto } from './create-momo-payment.dto';

export class UpdateMomoPaymentDto extends PartialType(CreateMomoPaymentDto) {}
