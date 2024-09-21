import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaDbModule } from './prisma-db/prisma-db.module';
import { AccountsModule } from './accounts/accounts.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { ProductsModule } from './products/products.module';
import { ImportationsModule } from './importations/importations.module';

@Module({
  imports: [PrismaDbModule, AccountsModule, VouchersModule, ProductsModule, ImportationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
