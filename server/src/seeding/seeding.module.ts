import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';

@Module({
  providers: [SeedingService],
})
export class SeedingModule {}
