import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InboxService } from './inbox.service';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { CreateInboxMessageDto } from './dto/create-inbox.dto';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post(':customer_id')
  async create(
    @Param('customer_id') customer_id: string,
    @Body() createInboxDto: CreateInboxMessageDto,
  ) {
    return await this.inboxService.create(customer_id, createInboxDto);
  }

  @Get()
  async findAll() {
    return this.inboxService.findAll();
  }

  @Get(':customer_id')
  async findOne(@Param('customer_id') customer_id: string) {
    return this.inboxService.getMessageByRoom(customer_id, 0, 20, true);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInboxDto: UpdateInboxDto,
  ) {
    return this.inboxService.update(id, updateInboxDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.inboxService.remove(id);
  }
}
