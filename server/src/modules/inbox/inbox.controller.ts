import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InboxService } from './inbox.service';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { CreateInboxMessageDto } from './dto/create-inbox.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post(':customer_id')
  @Permissions(['inbox-create'])
  async create(
    @Param('customer_id') customer_id: string,
    @Body() createInboxDto: CreateInboxMessageDto,
  ) {
    return await this.inboxService.create(customer_id, createInboxDto);
  }

  @Get()
  @Permissions(['inbox-read'])
  async findAll(
    @Query('q') customer_name_id: string = '',
    @Query('pageSize') limit: string,
    @Query('current') offset: string,
  ) {
    return this.inboxService.findAll(
      customer_name_id,
      +limit,
      (+offset > 0 ? +offset - 1 : 0) * +limit,
    );
  }

  @Get(':customer_id')
  @Permissions(['inbox-read'])
  async findOne(@Param('customer_id') customer_id: string) {
    const messages = await this.inboxService.getMessageByRoom(
      customer_id,
      0,
      20,
      true,
    );

    return messages;
  }

  @Patch(':id')
  @Permissions(['inbox-update'])
  async update(
    @Param('id') id: string,
    @Body() updateInboxDto: UpdateInboxDto,
  ) {
    return this.inboxService.update(id, updateInboxDto);
  }

  @Delete(':id')
  @Permissions(['inbox-delete'])
  async remove(@Param('id') id: string) {
    return this.inboxService.remove(id);
  }
}
