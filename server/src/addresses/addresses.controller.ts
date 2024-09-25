import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Prisma } from '@prisma/client';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post(':id')
  async create(
    @Param('id') customerId: string,
    @Body() createAddressDto: Prisma.Customer_AddressCreateInput,
  ) {
    try {
      const addressDto: Prisma.Customer_AddressCreateInput = {
        customer: {
          connect: {
            customer_id: customerId,
          },
        },
        address: createAddressDto.address,
        city: createAddressDto.city,
        state: createAddressDto.state,
      };
      const address = await this.addressesService.create(addressDto);
      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Creating address failed');
    }
  }

  @Get(':id')
  async findAll(@Param('id') customerId: string) {
    try {
      const address = await this.addressesService.findAll(customerId);
      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Fetching address failed');
    }
  }

  @Get(':id/:address_id')
  async findOne(
    @Param('id') customerId: string,
    @Param('address_id', ParseIntPipe) addressId: number,
  ) {
    try {
      const address = await this.addressesService.findOne(
        customerId,
        addressId,
      );
      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Fetching address failed');
    }
  }

  @Patch(':id/:address_id')
  async update(
    @Param('id') customerId: string,
    @Param('address_id', ParseIntPipe) addressId: number,
    @Body() updateAddressDto: Prisma.Customer_AddressUpdateInput,
  ) {
    try {
      const addressDto: Prisma.Customer_AddressUpdateInput = {
        address: updateAddressDto.address,
        city: updateAddressDto.city,
        state: updateAddressDto.state,
      };
      const address = await this.addressesService.update(
        customerId,
        addressId,
        addressDto,
      );
      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Updating address failed');
    }
  }

  @Delete(':id/:address_id')
  async remove(
    @Param('id') customerId: string,
    @Param('address_id', ParseIntPipe) addressId: number,
  ) {
    try {
      const address = await this.addressesService.remove(customerId, addressId);
      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Deleting address failed');
    }
  }

  @Delete(':id')
  async removeAll(@Param('id') customerId: string) {
    try {
      const address = await this.addressesService.removeAll(customerId);
      return address;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Deleting all addresses failed');
    }
  }
}
