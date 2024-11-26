import {
  BadRequestException,
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from '../staff/staff.service';
import { CustomersService } from '../customers/customers.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PermissionsService } from '../../permissions/permissions.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly staffService: StaffService,
    private readonly customerService: CustomersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get('staff')
  @UseGuards(AuthGuard)
  async getStaff(@Request() req: any) {
    const { user } = req;
    if (!user) {
      throw new BadRequestException('Unauthorized');
    }

    const { id } = user;
    return await this.staffService.findOne(id);
  }

  @Get('staff/permissions')
  @UseGuards(AuthGuard)
  async getStaffPermissions(@Request() req: any) {
    const { user } = req;
    if (!user) {
      throw new BadRequestException('Unauthorized');
    }

    const { role } = user;
    return await this.permissionsService.findByRole(role.role_id);
  }

  @Get('customer')
  @UseGuards(AuthGuard)
  async getCustomer(@Request() req: any) {
    const { user } = req;
    if (!user) {
      throw new BadRequestException('Unauthorized');
    }

    const { id } = user;
    return await this.customerService.findOne(id);
  }
}
