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
import { VouchersService } from './vouchers.service';
import { Prisma } from '@prisma/client';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  async create(@Body() createVoucherDto: Prisma.VouchersCreateInput) {
    try {
      const voucher = await this.vouchersService.create(createVoucherDto);
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating voucher failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const vouchers = await this.vouchersService.findAll();
      return vouchers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching vouchers failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const voucher = await this.vouchersService.findOne(id);
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching voucher failed');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: Prisma.VouchersUpdateInput,
  ) {
    try {
      const voucher = await this.vouchersService.update(id, updateVoucherDto);
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating voucher failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const voucher = await this.vouchersService.remove(id);
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Deleting voucher failed');
    }
  }
}
