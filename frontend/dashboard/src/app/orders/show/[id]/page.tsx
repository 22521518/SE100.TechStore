'use client';

import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import OrderStatusTag from '@components/tags/order-status-tag';
import { IOrder } from '@constant/interface.constant';
import { Box, Button, Stack, Typography } from '@mui/material';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import React from 'react';
import { ORDER_STATUS, PAYMENT_STATUS } from '@constant/enum.constant';
import {
  transformDateWithMonthText,
  transformVNMoney
} from '@utils/transform.util';
import ProductCard from '@components/order/product-card';
import { dummyAvatar } from '@constant/value.constant';
import { HttpError, useForm } from '@refinedev/core';
import PaymentStatusTag from '@components/tags/payment_status';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

type OrderShowProps = {
  onUpdateOrderStatus: (status: IOrder) => void;
  customerId?: string;
  orderId?: string;
};

const OrderShow = ({
  orderId,
  customerId,
  onUpdateOrderStatus
}: OrderShowProps) => {
  const orderStatusColors = {
    PENDING: '#FF9800',
    CONFIRMED: '#4CAF50',
    SHIPPED: '#2196F3',
    DELIVERED: '#8BC34A',
    CANCELLED: '#F44336'
  };

  const { query, formLoading, onFinish } = useForm<IOrder, HttpError>({
    resource: 'orders/' + customerId,
    id: orderId,
    action: 'edit'
  });

  const order = query?.data?.data;
  const [orderValue, setOrderValue] = React.useState<IOrder>({
    order_id: order?.order_id || '',
    customer_id: order?.customer_id || '',
    order_status: order?.order_status || ORDER_STATUS.PENDING,
    payment_status: order?.payment_status || PAYMENT_STATUS.PENDING,
    total_price: order?.total_price || 0,
    order_items: order?.order_items || [],
    created_at: order?.created_at || ''
  });
  const [orderStatus, setOrderStatus] = React.useState<ORDER_STATUS>(
    order?.order_status || ORDER_STATUS.PENDING
  );

  const orderItems = order?.order_items;
  const totalItem = orderItems?.reduce((acc, item) => acc + item.quantity, 0);
  const orgTotalPrice =
    orderItems?.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    ) || 0;
  const customer = order?.customer;
  const address = order?.shipping_address;

  const updateOrderStatus = async (status: ORDER_STATUS) => {
    try {
      const res = await onFinish({
        ...orderValue,
        order_status: status
      });
      if (res) {
        setOrderStatus(status);
        const newOrder = {
          ...orderValue,
          order_status: status
        };
        setOrderValue(newOrder);
        onUpdateOrderStatus(newOrder);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (order) {
      setOrderValue({
        order_id: order.order_id,
        customer_id: order.customer_id,
        order_status: order.order_status,
        payment_status: order.payment_status,
        total_price: order.total_price,
        order_items: order.order_items,
        created_at: order.created_at
      });

      setOrderStatus(order?.order_status || ORDER_STATUS.PENDING);
    }
  }, [order]);

  return (
    <Stack className="gap-4">
      <CommonContainer className="flex justify-between items-center">
        <Typography className="font-bold">Order details</Typography>
        {order && (
          <Box className="flex justify-between items-center gap-4 flex-row-reverse">
            <Button
              className=" text-white min-w-8 px-2 h-max w-max py-2 flex flex-row gap-1"
              style={{
                backgroundColor:
                  formLoading || order.order_status !== ORDER_STATUS.PENDING
                    ? 'gray'
                    : orderStatusColors[ORDER_STATUS.CONFIRMED]
              }}
              disabled={
                formLoading || order.order_status !== ORDER_STATUS.PENDING
              }
              onClick={() => updateOrderStatus(ORDER_STATUS.CONFIRMED)}
            >
              <DoneOutlinedIcon className="font-bold text-base" />

              <Typography variant="caption" className="font-bold text-sm">
                Confirm
              </Typography>
            </Button>
            <Button
              className="bg-white min-w-8 px-4 h-max w-max py-2 flex flex-row gap-1"
              disabled={
                formLoading || order.order_status !== ORDER_STATUS.PENDING
              }
              style={{
                color:
                  formLoading || order.order_status !== ORDER_STATUS.PENDING
                    ? 'gray'
                    : orderStatusColors[ORDER_STATUS.CANCELLED]
              }}
              onClick={() => updateOrderStatus(ORDER_STATUS.CANCELLED)}
            >
              <CloseOutlinedIcon className="font-extrabold text-base" />
              <Typography variant="caption" className="font-bold text-sm">
                Cancel
              </Typography>
            </Button>
          </Box>
        )}
      </CommonContainer>
      {order && (
        <>
          <CommonContainer>
            <Box className="flex flex-col gap-2 justify-between items-start border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-base">
                  Order ID:
                </Typography>
                <Typography className="text-base">{order.order_id}</Typography>
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-base">
                  Status:
                </Typography>
                <OrderStatusTag status={orderStatus} />
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
                  <Typography className="text-base text-secondary-border-secondary-300">
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
                <Typography className="font-semibold text-base">
                  Amounts:
                </Typography>
                <Typography className="text-base">{totalItem} items</Typography>
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-base">
                  Total:
                </Typography>
                <Typography className="text-base">
                  {transformVNMoney(order.total_price)}
                </Typography>
              </Box>
            </Box>
            <Box className="flex flex-row gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-base">
                  Voucher:
                </Typography>
                <Typography className="text-base">
                  {order.voucher
                    ? order.voucher.voucher_code +
                      `${order.voucher.discount_amount}%`
                    : 'None'}
                </Typography>
              </Box>
              <Box className="flex flex-row gap-2 items-center">
                <Typography className="font-semibold text-base">
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
