import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountsModule } from 'src/modules/accounts/accounts.module';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { StaffModule } from 'src/modules/staff/staff.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    AccountsModule,
    CustomersModule,
    StaffModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10h' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
