import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { StaffModule } from '../staff/staff.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  controllers: [ProfileController],
  imports: [StaffModule, CustomersModule],
})
export class ProfileModule {}
