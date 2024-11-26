import { Module } from '@nestjs/common';
import { ImportationsService } from './importations.service';
import { ImportationsController } from './importations.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [ImportationsController],
  providers: [ImportationsService],
  imports: [ProductsModule],
})
export class ImportationsModule {}
