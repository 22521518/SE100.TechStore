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
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('ships')
export class ShipsController {
  constructor(private readonly shipsService: ShipsService) {}

  @Post()
  @Permissions(['ship-create'])
  async create(
    @Body()
    createShipDto: CreateShipDto,
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
  @Permissions(['ship-read'])
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
  @Permissions(['ship-read'])
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
  @Permissions(['ship-update'])
  async update(@Param('id') id: string, @Body() updateShipDto: UpdateShipDto) {
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
  @Permissions(['ship-delete'])
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
