import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Prisma } from '@prisma/client';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(
    @Body()
    createStaffDto: CreateStaffDto,
  ) {
    try {
      const { account_id, ...rest } = createStaffDto;
      const staffDto: Prisma.StaffCreateInput = {
        ...rest,
        account: {
          connect: {
            account_id: account_id,
          },
        },
      };
      const staff = await this.staffService.create(staffDto);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating staff failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const staff = await this.staffService.findAll();
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching all staff failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const staff = await this.staffService.findOne(id);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching staff failed');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateStaffDto: UpdateStaffDto,
  ) {
    try {
      const { full_name, phone_number, employee_status, role_id } =
        updateStaffDto;
      if (!full_name && !phone_number) {
        throw new BadRequestException('No data to update');
      }

      const staffDto: Prisma.StaffUpdateInput = {
        full_name,
        phone_number,
        employee_status,
        ...(role_id && {
          role: {
            connect: {
              role_id: role_id,
            },
          },
        }),
      };

      const staff = await this.staffService.update(id, staffDto);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating staff failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const staff = await this.staffService.remove(id);
      return staff;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting staff failed');
    }
  }
}
