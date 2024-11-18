import { PartialType } from '@nestjs/mapped-types';
import { CreateSeedingDto } from './create-seeding.dto';

export class UpdateSeedingDto extends PartialType(CreateSeedingDto) {}
