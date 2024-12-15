'use client';

import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import OrderStatusTag from '@components/tags/order-status-tag';
import { IOrder } from '@constant/interface.constant';
import { Box, Stack, Typography } from '@mui/material';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import React from 'react';
import { ORDER_STATUS } from '@constant/enum.constant';
import {
  transformDateWithMonthText,
  transformVNMoney
} from '@utils/transform.util';
import ProductCard from '@components/order/product-card';
import { dummyAvatar } from '@constant/value.constant';
import { HttpError, useForm } from '@refinedev/core';
import PaymentStatusTag from '@components/tags/payment_status';

type OrderShowProps = {
  customerId?: string;
  orderId?: string;
};

const OrderShow = ({ orderId, customerId }: OrderShowProps) => {
  const { query, formLoading } = useForm<IOrder, HttpError>({
    resource: 'orders/' + customerId,
    id: orderId,
    action: 'clone'
  });

  const order = query?.data?.data;

  const orderItems = order?.order_items;
  const totalItem = orderItems?.reduce((acc, item) => acc + item.quantity, 0);
  const orgTotalPrice =
    orderItems?.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    ) || 0;
  const customer = order?.customer;
  const address = order?.shipping_address;

  return (
    <Stack className="gap-4">
      <CommonContainer>
        <Typography className="font-bold">Order details</Typography>
      </CommonContainer>
      {order && (
        <>
          <CommonContainer>
            <Box className="flex flex-row gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-sm">
                  Order ID:
                </Typography>
                <Typography className="text-sm">{order.order_id}</Typography>
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-sm">
                  Status:
                </Typography>
                <OrderStatusTag status={order.order_status} />
              </Box>
            </Box>

            <Box className="flex flex-row gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-2 items-start">
                <AvatarImage
                  src={customer?.image || dummyAvatar}
                  alt={customer?.username || 'avatar'}
                  size={48}
                />
                <Stack className="">
                  <Typography className="font-semibold text-lg">
                    {customer?.username || 'username'}
                  </Typography>
                  <Typography className="text-sm text-secondary-border-secondary-300">
                    {customer?.customer_id || 'customer_id'}
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Stack className="gap-2 border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-2 justify-between items-center pb-4">
                <Typography className="font-semibold text-base">
                  Deliveried date:
                </Typography>
                <Typography
                  variant="caption"
                  className="text-base text-secondary-border-secondary-300"
                >
                  {order.shipping_address?.shipping_status ===
                    ORDER_STATUS.DELIVERED &&
                  order.shipping_address?.delivery_date
                    ? transformDateWithMonthText(
                        order.shipping_address?.delivery_date?.toString()
                      )
                    : 'Not yet'}
                </Typography>
              </Box>
              <Box className="flex flex-row gap-2 justify-between items-center pb-4">
                <Typography className="font-semibold text-base">
                  Payment Method:
                </Typography>
                <Typography
                  variant="caption"
                  className="text-base text-secondary-border-secondary-300"
                >
                  {order.payment_method}
                </Typography>
              </Box>
              <Box className="flex flex-row gap-2 justify-between items-center pb-4">
                <Typography className="font-semibold text-base">
                  Payment Status:
                </Typography>
                <Typography
                  variant="caption"
                  className="text-base text-secondary-border-secondary-300"
                >
                  <PaymentStatusTag status={order.payment_status} />
                </Typography>
              </Box>
            </Stack>

            <Box className="flex flex-col gap-2 border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-3 items-center">
                <Typography className="item-center">
                  <HouseOutlinedIcon /> Address:
                </Typography>
                <Typography
                  variant="caption"
                  className="text-base text-secondary-border-secondary-300"
                >
                  {address
                    ? `${address?.address}, ${address?.district}, ${address?.city}`
                    : 'No address'}
                </Typography>
              </Box>
              <Box className="flex flex-row gap-4 items-center">
                <Typography className="item-center">
                  <CallOutlinedIcon /> Phone:
                </Typography>
                <Typography
                  variant="caption"
                  className="text-base text-secondary-border-secondary-300"
                >
                  {customer?.phone_number}
                </Typography>
              </Box>
            </Box>
          </CommonContainer>

          <CommonContainer>
            <Box className="flex flex-row gap-2 justify-between items-center">
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-sm">
                  Amounts:
                </Typography>
                <Typography className="text-sm">{totalItem} items</Typography>
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-sm">
                  Total:
                </Typography>
                <Typography className="text-sm">
                  {transformVNMoney(order.total_price)}
                </Typography>
              </Box>
            </Box>
            <Box className="flex flex-row gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-sm">
                  Voucher:
                </Typography>
                <Typography className="text-sm">
                  {order.voucher
                    ? order.voucher.voucher_code +
                      `${order.voucher.discount_amount}%`
                    : 'None'}
                </Typography>
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-sm">
                  -{' '}
                  {transformVNMoney(
                    order.voucher
                      ? order.voucher.discount_amount * orgTotalPrice
                      : 0
                  )}{' '}
                </Typography>
              </Box>
            </Box>

            <Box className="flex flex-col gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              {orderItems?.map((item, index) => (
                <Box key={index} className="w-full">
                  <ProductCard orderItem={item} />
                </Box>
              ))}
            </Box>
          </CommonContainer>
        </>
      )}
    </Stack>
  );
};

export default OrderShow;
