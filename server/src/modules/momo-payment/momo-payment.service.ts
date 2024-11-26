import { BadRequestException, Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { createHmac } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { AddressesService } from '../addresses/addresses.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { ShippingAddress } from '../orders/entities/order.entity';
import { Prisma } from '@prisma/client';
import { CallbackMomoDto } from './dto/callback-momo.dto';

@Injectable()
export class MomoPaymentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly ordersService: OrdersService,
    private readonly addressesService: AddressesService,
  ) {}

  private producerawSignature(orderId: string, requestId: string): string {
    return (
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType
    );
  }

  private produceSignature(orderId: string, requestId: string) {
    return createHmac('sha256', secretKey)
      .update(this.producerawSignature(orderId, requestId))
      .digest('hex');
  }

  private produceRequestData(orderId: string, requestId: string) {
    return JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: this.produceSignature(orderId, requestId),
    });
  }

  async requestMomoPayment(orderId: string) {
    const requestBody = this.produceRequestData(orderId, orderId);

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

  async handleCallback(body: CallbackMomoDto) {
    try {
      if (body.resultCode !== 0) {
        const { orderId, amount, transId } = body;
        this.ordersService.removeById(orderId);
      }
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
}

const momoPaymentUrl = 'https://test-payment.momo.vn/v2/gateway/api/create';

const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const extraData = '';
const orderGroupId = '';
const autoCapture = true;
const lang = 'vi';

const orderInfo = 'pay with MoMo';
const partnerCode = 'MOMO';
const requestType = 'payWithMethod';

const amount = '50000';

const redirectUrl = 'https://shopee.vn/';
const ipnUrl = 'https://255a-1-52-1-228.ngrok-free.app/momo-payment/callback';

// const paymentCode =
// 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
// const orderId = partnerCode + new Date().getTime();
// const requestId = orderId;
