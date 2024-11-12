import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

  @UseGuards(AuthGuard)
  @Permissions(['accounts:read'])
  @Get()
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
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