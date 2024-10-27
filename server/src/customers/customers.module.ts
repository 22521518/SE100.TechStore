import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [AccountsModule],
  exports: [CustomersService],
})
export class CustomersModule {}
