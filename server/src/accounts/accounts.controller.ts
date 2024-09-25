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
import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDto: Prisma.AccountsCreateInput) {
    try {
      const acc = await this.accountsService.create(createAccountDto);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating account failed');
    }
  }

  @Get()
  async findAll() {
    try {
      const acc = await this.accountsService.findAll();
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Finding accounts failed');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const acc = await this.accountsService.findOne(id);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Finding account failed');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateAccountDto: {
      password: string;
      is_active: boolean;
    },
  ) {
    try {
      const accountDto: Prisma.AccountsUpdateInput = {
        password: updateAccountDto.password,
        is_active: updateAccountDto.is_active,
      };
      const acc = await this.accountsService.update(id, accountDto);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating account failed');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const acc = await this.accountsService.remove(id);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Removing account failed');
    }
  }
}
