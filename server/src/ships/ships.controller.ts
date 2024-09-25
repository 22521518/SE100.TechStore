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
import { ShipsService } from './ships.service';
import { Prisma } from '@prisma/client';

@Controller('ships')
export class ShipsController {
  constructor(private readonly shipsService: ShipsService) {}

  @Post()
  async create(
    @Body()
    createShipDto: Prisma.Shipping_AddressCreateInput & {
      order_id: string;
      address_id: string;
    },
  ) {
    try {
      const { order_id, address_id } = createShipDto;
      const shipDto: Prisma.Shipping_AddressCreateInput = {
        order: {
          connect: {
            order_id: order_id,
          },
        },
        address: {
          connect: {
            address_id: +address_id,
          },
        },
      };
      const ship = await this.shipsService.create(shipDto);
      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating ship failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const ship = await this.shipsService.findAll();
      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating ship failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const ship = await this.shipsService.findOne(id);
      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating ship failed');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShipDto: Prisma.Shipping_AddressUpdateInput,
  ) {
    try {
      const { delivery_date, shipping_status } = updateShipDto;
      const shipDto: Prisma.Shipping_AddressUpdateInput = {
        delivery_date,
        shipping_status,
      };
      const ship = await this.shipsService.update(id, shipDto);
      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating ship failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const ship = await this.shipsService.remove(id);
      return ship;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating ship failed');
    }
  }
}
