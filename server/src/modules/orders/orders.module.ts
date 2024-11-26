import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AddressesModule } from '../addresses/addresses.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [AddressesModule],
})
export class OrdersModule {}
