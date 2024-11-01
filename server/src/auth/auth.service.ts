import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from 'src/modules/accounts/accounts.service';
import { CustomersService } from 'src/modules/customers/customers.service';
import { StaffService } from 'src/modules/staff/staff.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly customersService: CustomersService,
    private readonly staffService: StaffService,
    private readonly jwtService: JwtService,
  ) {}

  private async authenticate(email: string, password: string) {
    const account = await this.accountsService.findOneByEmail(email);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const isPasswordValid = await this.accountsService.comparePassword(
      password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return account;
  }

  async signInByStaff(email: string, password: string) {
    try {
      const account = await this.authenticate(email, password);
      const staff = await this.staffService.findOneByAccount(
        account.account_id,
      );

      if (!staff) {
        throw new BadRequestException('Staff not found');
      }

      const payload = {
        sub: staff.staff_id,
        role: staff.role,
        permissions: staff.role.role_permissions ?? [],
        iat: Math.floor(Date.now() / 1000),
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async signInByCustomer(email: string, password: string) {
    try {
      const account = await this.authenticate(email, password);
      const customer = await this.customersService.findOneByAccount(
        account.account_id,
      );

      if (!customer) {
        throw new BadRequestException('Customer not found');
      }

      const payload = {
        sub: customer.customer_id,
        role: 'customer',
        permissions: ['accounts:read'],
        iat: Math.floor(Date.now() / 1000),
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
