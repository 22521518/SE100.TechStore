import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaDbModule } from './prisma-db/prisma-db.module';
import { AccountsModule } from './accounts/accounts.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { ProductsModule } from './products/products.module';
import { ImportationsModule } from './importations/importations.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    PrismaDbModule,
    AccountsModule,
    VouchersModule,
    ProductsModule,
    ImportationsModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
