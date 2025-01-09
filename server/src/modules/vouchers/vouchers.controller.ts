import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { Prisma } from '@prisma/client';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @Permissions(['voucher-create'])
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    try {
      const validDateTo = new Date(createVoucherDto.valid_to);
      const validDateFrom = new Date(createVoucherDto.valid_from);

      if (validDateFrom > validDateTo) {
        throw new BadRequestException(
          'Valid from date cannot be after valid to date',
        );
      }

      const today = new Date();

      const isActive =
        validDateFrom.getFullYear() <= today.getFullYear() &&
        validDateFrom.getMonth() <= today.getMonth() &&
        validDateFrom.getDate() <= today.getDate() &&
        validDateTo.getFullYear() >= today.getFullYear() &&
        validDateTo.getMonth() >= today.getMonth() &&
        validDateTo.getDate() >= today.getDate();

      const voucherDto: Prisma.VouchersCreateInput = {
        voucher_name: createVoucherDto.voucher_name,
        description: createVoucherDto.description,
        discount_amount: createVoucherDto.discount_amount,
        valid_from: createVoucherDto.valid_from,
        valid_to: createVoucherDto.valid_to,
        is_active: isActive,
      };
      const voucher = await this.vouchersService.create(voucherDto);
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating voucher failed');
    }
  }

  @Get()
  @Permissions(['voucher-read'])
  async findAll(
    @Query('voucher_code') voucher_code: string,
    @Query('q') voucher_name: string,
  ) {
    try {
      const vouchers = await this.vouchersService.findAll(
        voucher_code,
        voucher_name,
      );
      return vouchers;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Fetching vouchers failed');
    }
  }

  @Get(':id')
  @Permissions(['voucher-read'])
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
  @Permissions(['voucher-update'])
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    try {
      const validDateTo = new Date(updateVoucherDto.valid_to);
      const validDateFrom = new Date(updateVoucherDto.valid_from);

      if (validDateFrom > validDateTo) {
        throw new BadRequestException(
          'Valid from date cannot be after valid to date',
        );
      }

      const today = new Date();

      const isActive =
        validDateFrom.getFullYear() <= today.getFullYear() &&
        validDateFrom.getMonth() <= today.getMonth() &&
        validDateFrom.getDate() <= today.getDate() &&
        validDateTo.getFullYear() >= today.getFullYear() &&
        validDateTo.getMonth() >= today.getMonth() &&
        validDateTo.getDate() >= today.getDate();

      const voucherDto: Prisma.VouchersUpdateInput = {
        voucher_name: updateVoucherDto.voucher_name,
        description: updateVoucherDto.description,
        discount_amount: updateVoucherDto.discount_amount,
        valid_from: updateVoucherDto.valid_from,
        valid_to: updateVoucherDto.valid_to,
        is_active: isActive,
      };
      const voucher = await this.vouchersService.update(id, voucherDto);
      return voucher;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating voucher failed');
    }
  }

  @Delete(':id')
  @Permissions(['voucher-delete'])
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
