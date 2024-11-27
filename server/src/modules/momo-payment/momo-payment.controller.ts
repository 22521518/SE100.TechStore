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
import { MomoItem } from './entities/momo-item.entity';
import { MomoPaymentStore } from './entities/payment_store.entity';

@Controller('momo-payment')
export class MomoPaymentController {
  constructor(
    private readonly momoPaymentService: MomoPaymentService,
    private readonly momoPaymentStore: MomoPaymentStore,
  ) {}

  @Post('cancel/:id')
  async cancelTransaction(@Param('id') customerId: string) {
    // return this.momoPaymentService.cancelTransaction(body);
    try {
      this.momoPaymentStore.removePaymentByCustomer(customerId, (orderId) =>
        this.momoPaymentService.removeOrder(orderId),
      );
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('callback')
  async callback(@Body() body: any) {
    console.log('Momo calback\n', body);
    return this.momoPaymentService.handleCMomoCallback(body);
  }

  @Post(':id')
  @Permissions(['order-create'])
  async create(
    @Param('id') customerId: string,
    @Body()
    createOrderDto: CreateMomoPaymentDto,
  ) {
    try {
      this.momoPaymentStore.removePaymentByCustomer(customerId, (orderId) =>
        this.momoPaymentService.removeOrder(orderId),
      );
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }

    try {
      const { redirectUrl, ...orderDto } = createOrderDto;
      const order = await this.momoPaymentService.createOrder(
        orderDto,
        customerId,
      );
      const { order_id, total_price, order_items } = order;

      this.momoPaymentStore.addPayment({
        orderId: order_id,
        customerId: customerId,
      });

      const items: MomoItem[] = order_items.map((item) => {
        return new MomoItem(
          item.product_id,
          item.product.product_name,
          item.product.images[0],
          item.unit_price,
          item.quantity,
          item.total_price,
        );
      });

      let redirect = null;
      if (redirectUrl != null && redirectUrl != undefined) {
        redirect = process.env.CLIENT + redirectUrl;
      }

      const rep = await this.momoPaymentService.requestMomoPayment(
        order_id,
        customerId,
        total_price,
        items,
        redirect,
      );

      setTimeout(() => {
        this.trackPaymentStatus(
          order_id,
          this.momoPaymentService.timeOut * 1000,
        );
      }, 0);

      return rep;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  private async trackPaymentStatus(orderId: string, totalSeconds: number) {
    let elapsedSeconds = 0;
    const intervalId = setInterval(async () => {
      elapsedSeconds++;
      const currentOrder = this.momoPaymentStore.getPaymentByOrder(orderId);
      if (!currentOrder) {
        clearInterval(intervalId);
        return;
      }

      try {
        const transactionSuccess =
          await this.momoPaymentService.checkTransaction(orderId);

        if (transactionSuccess) {
          clearInterval(intervalId);
        } else if (elapsedSeconds >= totalSeconds) {
          if (!transactionSuccess) {
            this.momoPaymentService.removeOrder(orderId);
            this.momoPaymentStore.removePaymentByCustomer(orderId, (id) =>
              this.momoPaymentService.removeOrder(id),
            );
          }
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error(
          `Error checking transaction for order ${orderId}:`,
          error.message,
        );
        clearInterval(intervalId);
      }
    }, 1000); // Run every second
  }

  @Get()
  findAll() {}

  @Get(':id')
  checkTransaction(@Param('id') orderId: string) {
    return orderId;
  }
}
