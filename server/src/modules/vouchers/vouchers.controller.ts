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
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    try {
      const voucherDto: Prisma.VouchersCreateInput = {
        voucher_name: createVoucherDto.voucher_name,
        description: createVoucherDto.description,
        discount_amount: createVoucherDto.discount_amount,
        valid_from: createVoucherDto.valid_from,
        valid_to: createVoucherDto.valid_to,
      };
      const voucher = await this.vouchersService.create(voucherDto);
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
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    try {
      const voucherDto: Prisma.VouchersUpdateInput = {
        voucher_name: updateVoucherDto.voucher_name,
        description: updateVoucherDto.description,
        discount_amount: updateVoucherDto.discount_amount,
        valid_from: updateVoucherDto.valid_from,
        valid_to: updateVoucherDto.valid_to,
      };
      const voucher = await this.vouchersService.update(id, voucherDto);
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
