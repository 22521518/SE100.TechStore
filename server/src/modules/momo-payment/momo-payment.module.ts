import { Module } from '@nestjs/common';
import { MomoPaymentService } from './momo-payment.service';
import { MomoPaymentController } from './momo-payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { HttpModule } from '@nestjs/axios';
import { AddressesModule } from '../addresses/addresses.module';
import { ProductsModule } from '../products/products.module';
import { MomoPaymentStore } from './entities/payment_store.entity';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    AddressesModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [MomoPaymentController],
  providers: [MomoPaymentService, MomoPaymentStore],
})
export class MomoPaymentModule {}
