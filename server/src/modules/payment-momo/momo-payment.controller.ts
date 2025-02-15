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
import { EPaymentOrderItem } from './entities/momo-item.entity';
import { PaymentStore } from './entities/payment_store.entity';
import { PAYMENT_STATUS } from '@prisma/client';

@Controller('momo-payment')
export class MomoPaymentController {
  constructor(
    private readonly momoPaymentService: MomoPaymentService,
    private readonly paymentStore: PaymentStore,
  ) {}

  @Post('cancel/:id')
  async cancelTransaction(@Param('id') customerId: string) {
    // return this.momoPaymentService.cancelTransaction(body);
    try {
      this.paymentStore.removePaymentByCustomer(customerId, (orderId) =>
        this.momoPaymentService.removeOrder(orderId),
      );
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('callback')
  async callback(@Body() body: any) {
    try {
      console.log('Momo calback\n', body);
      return this.momoPaymentService.handleCallback(body);
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('check/:id')
  async checkTransaction(@Param('id') orderId: string) {
    try {
      const paymentStatus =
        await this.momoPaymentService.checkPaymentStatus(orderId);
      return {
        status: paymentStatus,
        success: paymentStatus === PAYMENT_STATUS.PAID,
      };
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id')
  @Permissions(['order-create'])
  async create(
    @Param('id') customerId: string,
    @Body()
    createOrderDto: CreateMomoPaymentDto,
  ) {
    try {
      this.paymentStore.removePaymentByCustomer(customerId, (orderId) =>
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

      this.paymentStore.addPayment({
        orderId: order_id,
        customerId: customerId,
      });

      const items: EPaymentOrderItem[] = order_items.map((item) => {
        return new EPaymentOrderItem(
          item.product_id,
          item.product.product_name,
          item.product.images[0],
          Number(item.unit_price),
          item.quantity,
          Number(item.total_price),
        );
      });

      let redirect = null;
      if (redirectUrl != null && redirectUrl != undefined) {
        redirect = redirectUrl; //process.env.CLIENT + redirectUrl;
      }

      const rep = await this.momoPaymentService.requestPayment(
        order_id,
        customerId,
        Number(total_price) * 0 + 50000,
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
      const currentOrder = this.paymentStore.getPaymentByOrder(orderId);
      if (!currentOrder) {
        clearInterval(intervalId);
        return;
      }

      try {
        const transactionSuccess =
          await this.momoPaymentService.checkTransaction(orderId);

        if (transactionSuccess) {
          this.paymentStore.removePaymentByOrder(orderId);
          clearInterval(intervalId);
        } else if (elapsedSeconds >= totalSeconds) {
          if (!transactionSuccess) {
            this.momoPaymentService.removeOrder(orderId);
            this.paymentStore.removePaymentByOrder(orderId, (id) =>
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
}
