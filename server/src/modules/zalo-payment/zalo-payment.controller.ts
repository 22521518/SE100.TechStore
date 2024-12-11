import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ZaloPaymentService } from './zalo-payment.service';
import { CreateMomoPaymentDto } from '../momo-payment/dto/create-momo-payment.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PaymentStore } from '../momo-payment/entities/payment_store.entity';
import { EPaymentOrderItem } from '../momo-payment/entities/momo-item.entity';
import { PAYMENT_STATUS } from '@prisma/client';

@Controller('zalo-payment')
export class ZaloPaymentController {
  constructor(
    private readonly zaloPaymentService: ZaloPaymentService,
    private readonly paymentStore: PaymentStore,
  ) {}

  @Post('callback')
  async callback(@Body() body: any) {
    try {
      return this.zaloPaymentService.handleCallback(body);
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('order-status/:id')
  async orderStatus(@Param('id') app_trans_id: string) {
    try {
      console.log('Zalo order status\n', app_trans_id);
      return this.zaloPaymentService.handleOrderStatus(app_trans_id);
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('cancel/:id')
  async cancelTransaction(@Param('id') customerId: string) {
    try {
      this.paymentStore.removePaymentByCustomer(customerId, (orderId) =>
        this.zaloPaymentService.removeOrder(orderId),
      );
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('check/:id')
  async checkTransaction(@Param('id') orderId: string) {
    try {
      const paymentStatus =
        await this.zaloPaymentService.checkPaymentStatus(orderId);
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
        this.zaloPaymentService.removeOrder(orderId),
      );
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }

    try {
      const { redirectUrl, ...orderDto } = createOrderDto;
      const order = await this.zaloPaymentService.createOrder(
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
          item.unit_price,
          item.quantity,
          item.total_price,
        );
      });

      let redirect = null;
      if (redirectUrl != null && redirectUrl != undefined) {
        redirect = process.env.CLIENT + redirectUrl;
      }

      const rep = await this.zaloPaymentService.requestPayment(
        order_id,
        customerId,
        total_price,
        items,
        redirect,
      );

      setTimeout(() => {
        this.trackPaymentStatus(
          order_id,
          this.zaloPaymentService.timeOut * 1000,
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
      console.log(
        'Checking transaction for order',
        this.paymentStore.getPayments(),
      );
      console.log('Elapsed seconds:', elapsedSeconds);

      elapsedSeconds++;
      const currentOrder = this.paymentStore.getPaymentByOrder(orderId);
      if (!currentOrder) {
        clearInterval(intervalId);
        return;
      }

      try {
        const transactionSuccess =
          await this.zaloPaymentService.checkTransaction(orderId);

        if (transactionSuccess) {
          this.paymentStore.removePaymentByOrder(orderId);
          clearInterval(intervalId);
        } else if (elapsedSeconds >= totalSeconds) {
          if (!transactionSuccess) {
            this.zaloPaymentService.removeOrder(orderId);
            this.paymentStore.removePaymentByOrder(orderId, (id) =>
              this.zaloPaymentService.removeOrder(id),
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
