import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { PrismaDbService } from 'src/databases/prisma-db/prisma-db.service';
import { OrdersService } from '../orders/orders.service';
import { AddressesService } from '../addresses/addresses.service';
import { createHmac } from 'crypto';
import { EPaymentOrderItem } from '../payment-momo/entities/momo-item.entity';
import moment from 'moment';
import { PAYMENT_STATUS, Prisma } from '@prisma/client';
import { ShippingAddress } from '../orders/entities/order.entity';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import qs from 'qs';

@Injectable()
export class ZaloPaymentService {
  readonly timeOut = 0.9; // 15 minutes
  private redirectUrl = 'https://shopee.vn';
  private orderInfo = 'Thanh toán đơn hàng ';
  private ipnUrl = `${process.env.HOST}/zalo-payment/callback`;

  constructor(
    private readonly httpService: HttpService,
    private readonly productsService: ProductsService,
    private readonly prismaDbService: PrismaDbService,
    readonly ordersService: OrdersService,
    private readonly addressesService: AddressesService,
  ) {}

  async requestPayment(
    orderId: string,
    customerId: string,
    amount: number,
    items: EPaymentOrderItem[],
    redirectUrl?: string | undefined,
  ) {
    try {
      const embed_data = {
        redirecturl: redirectUrl ?? this.redirectUrl,
        orderId: orderId,
      };

      // const items = [...items];
      const transID = orderId;
      const customer = await this.prismaDbService.customers.findUnique({
        where: { customer_id: customerId },
      });

      if (!customer) {
        throw new BadRequestException('Customer not found');
      }

      if (items.length === 0) {
        throw new BadRequestException('Items not found');
      }
      const orderInfo = this.orderInfo + orderId + customerId;

      const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: customer?.username,
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: orderInfo, //`HiveStore - Payment for the order #${transID}`,
        bank_code: '', // 'zalopayapp',
        mac: '',
        callback_url: this.ipnUrl,
      };
      // appid|app_trans_id|appuser|amount|apptime|embeddata|item
      const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;

      order.mac = createHmac('sha256', config.key1).update(data).digest('hex');

      try {
        const response = await lastValueFrom(
          this.httpService
            .post(config.endpoint_create, null, {
              params: order,
            })
            .pipe(
              map((res) => res.data),
              catchError((error: AxiosError) => {
                throw new Error(error.message);
              }),
            ),
        );
        return response;
      } catch (error: BadRequestException | any) {
        throw new BadRequestException(`Can't request payment ${error}`);
      }
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async handleCallback(body: any) {
    const result = {
      return_code: -1,
      return_message: 'Invalid request',
    };
    try {
      const dataStr = body.data;
      const reqMac = body.mac;

      const mac = createHmac('sha256', config.key2)
        .update(dataStr)
        .digest('hex');

      if (mac !== reqMac) {
        const dataJson = JSON.parse(dataStr);
        const embedDataJson = JSON.parse(dataJson.embed_data);
        const { orderId } = embedDataJson;
        this.removeOrder(orderId);
        return result;
      } else {
        const updateOrderDto: Prisma.OrdersUpdateInput = {
          payment_status: PAYMENT_STATUS.PAID,
        };
        const dataJson = JSON.parse(dataStr);
        const embedDataJson = JSON.parse(dataJson.embed_data);
        const { orderId } = embedDataJson;

        console.log(
          "update order's status = success where app_trans_id =",
          dataJson['app_trans_id'],
        );

        result.return_code = 1;
        result.return_message = 'success';

        return await this.updateOrder(orderId, updateOrderDto);
      }
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async handleOrderStatus(app_trans_id: any) {
    try {
      const postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id,
        mac: '',
      };

      const data =
        postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
      postData.mac = createHmac('sha256', config.key1)
        .update(data)
        .digest('hex');

      // const postConfig = {};

      try {
        const response = this.httpService
          .post(config.endpoint_query, null, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify(postData),
          })
          .pipe(
            map((res) => res.data),
            catchError((error: AxiosError) => {
              throw new Error(error.message);
            }),
          );
        return response;
      } catch (error: BadRequestException | any) {
        throw new BadRequestException(`Can't request payment ${error}`);
      }
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async checkPaymentStatus(orderId: string) {
    try {
      const order = await this.ordersService.findByOrderId(orderId);
      if (!order) {
        return null;
      }
      const { payment_status } = order;
      return payment_status;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async checkTransaction(orderId: string): Promise<boolean> {
    try {
      const status = await this.checkPaymentStatus(orderId);
      return status === PAYMENT_STATUS.PAID;
    } catch (error: BadRequestException | any) {
      throw new BadRequestException(error.message);
    }
  }

  async createOrder(createOrderDto: CreateOrderDto, customerId: string) {
    try {
      const { order_items, voucher_code, shipping_address, ...ord } =
        createOrderDto;

      if (!shipping_address) {
        throw new BadRequestException('Shipping address not found');
      }

      const addressDto: Prisma.Customer_AddressCreateInput = {
        customer: {
          connect: {
            customer_id: customerId,
          },
        },
        ...shipping_address,
        is_primary: true,
      };
      const existingAddress =
        await this.prismaDbService.customer_Address.findFirst({
          where: {
            customer_id: customerId,
            city: shipping_address.city,
            district: shipping_address.district,
            ward: shipping_address.ward,
            address: shipping_address.address,
          },
        });
      if (!existingAddress) {
        await this.addressesService.create(addressDto);
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

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint_create: 'https://sb-openapi.zalopay.vn/v2/create',
  endpoint_refund: 'https://sb-openapi.zalopay.vn/v2/query_refund',
  endpoint_query: 'https://sb-openapi.zalopay.vn/v2/query',
};
