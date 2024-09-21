import { Module } from '@nestjs/common';
import { ImportationsService } from './importations.service';
import { ImportationsController } from './importations.controller';

@Module({
  controllers: [ImportationsController],
  providers: [ImportationsService],
})
export class ImportationsModule {}
