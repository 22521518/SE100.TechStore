import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AccountsModule } from 'src/modules/accounts/accounts.module';
import { CloudinaryDbModule } from 'src/databases/cloudinary-db/cloudinary-db.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [AccountsModule, CloudinaryDbModule],
  exports: [CustomersService],
})
export class CustomersModule {}
