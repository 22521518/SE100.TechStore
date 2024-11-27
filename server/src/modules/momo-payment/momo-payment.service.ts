import { BadRequestException, Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { createHmac } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { AddressesService } from '../addresses/addresses.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { ShippingAddress } from '../orders/entities/order.entity';
import { PAYMENT_STATUS, Prisma } from '@prisma/client';
import { CallbackMomoDto } from './dto/callback-momo.dto';
import { MomoItem } from './entities/momo-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class MomoPaymentService {
  readonly timeOut = 100;
  private redirectUrl = 'https://shopee.vn/';
  private orderInfo = 'Thanh toán đơn hàng ';
  private ipnUrl = `${process.env.HOST}/momo-payment/callback`;

  constructor(
    private readonly httpService: HttpService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly addressesService: AddressesService,
  ) {}

  private producerawSignature(
    orderId: string,
    customerId: string,
    requestId: string,
    amount: number,
    redirectUrl?: string | undefined,
  ): string {
    const orderInfo = this.orderInfo + orderId + customerId;

    return (
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      this.ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      (redirectUrl ?? this.redirectUrl) +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType
    );
  }

  private produceSignature(
    orderId: string,
    customerId: string,
    requestId: string,
    amount: number,
    redirectUrl?: string | undefined,
  ) {
    return createHmac('sha256', secretKey)
      .update(
        this.producerawSignature(
          orderId,
          customerId,
          requestId,
          amount,
          redirectUrl,
        ),
      )
      .digest('hex');
  }

  private produceRequestData(
    orderId: string,
    customerId: string,
    requestId: string,
    amount: number,
    items: MomoItem[],
    redirectUrl: string,
  ) {
    const orderInfo = this.orderInfo + orderId + customerId;

    return JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'HiveStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl ?? this.redirectUrl,
      ipnUrl: this.ipnUrl,
      lang: lang,
      requestType: requestType,
      orderExpireTime: this.timeOut,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      items: items,
      signature: this.produceSignature(orderId, customerId, requestId, amount),
    });
  }

  async requestMomoPayment(
    orderId: string,
    customerId: string,
    amount: number,
    items: MomoItem[],
    redirectUrl?: string | undefined,
  ) {
    const requestBody = this.produceRequestData(
      orderId,
      customerId,
      orderId,
      amount,
      items,
      redirectUrl ?? this.redirectUrl,
    );

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };
    try {
      const response = this.httpService
        .post(momoPaymentUrl, requestBody, options)
        .pipe(
          map((res) => res.data),
          catchError((error: AxiosError) => {
            throw new Error(error.message);
          }),
        );

      return response;
    } catch (error) {
      throw new BadRequestException(`Can't request payment ${error}`);
    }
  }

  async handleCMomoCallback(body: CallbackMomoDto) {
    try {
      if (body.resultCode !== 0) {
        const { orderId } = body;
        this.removeOrder(orderId);
      } else {
        const updateOrderDto: Prisma.OrdersUpdateInput = {
          payment_status: PAYMENT_STATUS.PAID,
        };
        return await this.updateOrder(body.orderId, updateOrderDto);
      }
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async checkTransaction(orderId: string) {
    try {
      const order = await this.ordersService.findByOrderId(orderId);
      return order?.payment_status === PAYMENT_STATUS.PAID;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async createOrder(createOrderDto: CreateOrderDto, customerId: string) {
    try {
      const { order_items, voucher_code, shipping_address_id, ...ord } =
        createOrderDto;
      const shipping_address = await this.addressesService.findOne(
        customerId,
        shipping_address_id,
      );

      if (!shipping_address) {
        throw new BadRequestException('Shipping address not found');
      }

      const shippingAddress: ShippingAddress = {
        city: shipping_address.city,
        district: shipping_address.district,
        ward: shipping_address.ward,
        address: shipping_address.address,

        full_name: shipping_address.full_name,
        phone_number: shipping_address.phone_number,
      };

      const orderDto: Prisma.OrdersCreateInput = {
        ...ord,
        shipping_address: {
          create: {
            ...shippingAddress,
          },
        },
        ...(voucher_code && {
          voucher: {
            connect: {
              voucher_code: voucher_code,
            },
          },
        }),
        order_items: {
          createMany: {
            data: order_items as Prisma.Order_ItemsCreateManyOrderInput[],
          },
        },
        customer: {
          connect: {
            customer_id: customerId,
          },
        },
      };

      const order = await this.ordersService.create(orderDto, order_items);
      return order;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async removeOrder(orderId: string) {
    try {
      const order = await this.ordersService.findByOrderId(orderId);
      if (!order) {
        return;
      }

      const { order_items } = order;
      for (const item of order_items) {
        await this.productsService.increaseStock(
          item.product_id,
          item.quantity,
        );
      }

      return await this.ordersService.removeById(orderId);
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateOrder(orderId: string, updateOrderDto: Prisma.OrdersUpdateInput) {
    try {
      return await this.ordersService.update(orderId, updateOrderDto);
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }
}

const momoPaymentUrl = 'https://test-payment.momo.vn/v2/gateway/api/create';
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

const extraData = '';
const orderGroupId = '';
const autoCapture = true;
const lang = 'vi';

const partnerCode = 'MOMO';
const requestType = 'payWithMethod';

// const paymentCode =
// 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
// const orderId = partnerCode + new Date().getTime();
// const requestId = orderId;
