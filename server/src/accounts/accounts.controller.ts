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
  create(@Body() createAccountDto: Prisma.AccountsCreateInput) {
    try {
      const acc = this.accountsService.create(createAccountDto);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating account failed');
    }
  }

  @Get()
  findAll() {
    try {
      const acc = this.accountsService.findAll();
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Finding accounts failed');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      const acc = this.accountsService.findOne(id);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Finding account failed');
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: Prisma.AccountsUpdateInput,
  ) {
    try {
      const acc = this.accountsService.update(id, updateAccountDto);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating account failed');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      const acc = this.accountsService.remove(id);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Removing account failed');
    }
  }
}
