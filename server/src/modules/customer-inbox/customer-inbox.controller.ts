import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UpdateCustomerInboxDto } from './dto/update-customer-inbox.dto';
import { InboxService } from 'src/modules/inbox/inbox.service';
import { CreateInboxMessageDto } from 'src/modules/inbox/dto/create-inbox.dto';

@Controller('customer-inbox')
export class CustomerInboxController {
  constructor(private readonly customerInboxService: InboxService) {}

  @Post(':customer_id')
  async create(
    @Param('customer_id') customer_id: string,
    @Body() createInboxDto: CreateInboxMessageDto,
  ) {
    return await this.customerInboxService.create(customer_id, createInboxDto);
  }

  // @Get()
  // findAll() {
  //   return this.customerInboxService.findAll();
  // }

  @Get(':customer_id')
  findOne(@Param('customer_id') customer_id: string) {
    return this.customerInboxService.getMessageByRoom(customer_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerInboxDto: UpdateCustomerInboxDto,
  ) {
    return this.customerInboxService.update(id, updateCustomerInboxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerInboxService.remove(id);
  }
}
