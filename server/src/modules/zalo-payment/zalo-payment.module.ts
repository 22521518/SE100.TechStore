import { Module } from '@nestjs/common';
import { ZaloPaymentService } from './zalo-payment.service';
import { ZaloPaymentController } from './zalo-payment.controller';
import { AddressesModule } from '../addresses/addresses.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { PaymentStore } from '../momo-payment/entities/payment_store.entity';
import { HttpModule } from '@nestjs/axios';

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
  controllers: [ZaloPaymentController],
  providers: [ZaloPaymentService, PaymentStore],
})
export class ZaloPaymentModule {}
