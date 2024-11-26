import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { MomoPaymentService } from './momo-payment.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateMomoPaymentDto } from './dto/create-momo-payment.dto';
import { CallbackMomoDto } from './dto/callback-momo.dto';

@Controller('momo-payment')
export class MomoPaymentController {
  constructor(private readonly momoPaymentService: MomoPaymentService) {}

  @Post('callback')
  async callback(@Body() body: CallbackMomoDto) {
    console.log('Momo calback\n', body);
    return this.momoPaymentService.handleCallback(body);
  }

  @Post(':id')
  @Permissions(['order-create'])
  async create(
    @Param('id') customerId: string,
    @Body()
    createOrderDto: CreateMomoPaymentDto,
  ) {
    try {
      const { redirectUrl, ...orderDto } = createOrderDto;
      console.log(redirectUrl);
      const order = await this.momoPaymentService.createOrder(
        orderDto,
        customerId,
      );
      const { order_id } = order;
      const rep = await this.momoPaymentService.requestMomoPayment(order_id);
      return rep;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {}

  @Get(':id')
  checkTransaction(@Param('id') orderId: string) {
    return orderId;
  }
}
