import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async GetCustomerByDate() {
    try {
      return await this.dashboardService.GetDashboardData();
    } catch {
      throw new Error('Failed to get dashboard data');
    }
  }
}
