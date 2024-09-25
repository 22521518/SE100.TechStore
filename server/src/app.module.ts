import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaDbModule } from './prisma-db/prisma-db.module';
import { AccountsModule } from './accounts/accounts.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { ProductsModule } from './products/products.module';
import { ImportationsModule } from './importations/importations.module';
import { SupplierModule } from './supplier/supplier.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';
import { CustomersModule } from './customers/customers.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrdersModule } from './orders/orders.module';
import { ShipsModule } from './ships/ships.module';
import { StaffModule } from './staff/staff.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    PrismaDbModule,
    AccountsModule,
    VouchersModule,
    ProductsModule,
    ImportationsModule,
    SupplierModule,
    CategoriesModule,
    CartsModule,
    CustomersModule,
    AddressesModule,
    OrdersModule,
    ShipsModule,
    StaffModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
