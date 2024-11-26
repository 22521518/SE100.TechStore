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
import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Permissions(['account-create'])
  async create(@Body() createAccountDto: CreateAccountsDto) {
    try {
      const accountDto: Prisma.AccountsCreateInput = {
        ...createAccountDto,
      };
      const acc = await this.accountsService.create(accountDto);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Creating account failed');
    }
  }

  @Get()
  @Permissions(['account-read'])
  async findAll(@Query('email') contain_email: string) {
    try {
      const acc = await this.accountsService.findAll(contain_email);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Finding accounts failed');
    }
  }

  @Get(':id')
  @Permissions(['account-read'])
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
  @Permissions(['account-update'])
  async update(
    @Param('id') id: string,
    @Body()
    updateAccountDto: UpdateAccountsDto,
  ) {
    try {
      const accountDto: Prisma.AccountsUpdateInput = {
        ...updateAccountDto,
      };
      const acc = await this.accountsService.update(id, accountDto);
      return acc;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Updating account failed');
    }
  }

  @Delete(':id')
  @Permissions(['account-delete'])
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
