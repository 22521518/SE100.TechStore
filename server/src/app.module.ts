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
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryDbService } from './cloudinary-db/cloudinary-db.service';
import { CloudinaryDbModule } from './cloudinary-db/cloudinary-db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGOBD_URI),
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
    CloudinaryDbModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryDbService],
})
export class AppModule {}
