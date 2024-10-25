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

type OrderShowProps = {
  order?: IOrder | null;
};

const OrderShow = ({ order }: OrderShowProps) => {
  const orderItems = order?.order_items;
  const totalItem = orderItems?.reduce((acc, item) => acc + item.quantity, 0);
  const customer = order?.customer;
  const address = order?.shipping_address?.address;

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
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

            <Box className="flex flex-row gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Typography className="font-semibold text-base">
                Deliveried date:
              </Typography>
              <Typography
                variant="caption"
                className="text-base text-secondary-border-secondary-300"
              >
                {order.order_status === ORDER_STATUS.DELIVERED &&
                order.shipping_address?.delivery_date
                  ? transformDateWithMonthText(
                      order.shipping_address?.delivery_date?.toString()
                    )
                  : 'Not yet'}
              </Typography>
            </Box>

            <Box className="flex flex-col gap-2 border-b-2 border-solid border-secondary-300 pb-4 mb-4">
              <Box className="flex flex-row gap-3 items-center">
                <HouseOutlinedIcon />
                <Typography
                  variant="caption"
                  className="text-base text-secondary-border-secondary-300"
                >
                  {address?.address}, {address?.state}, {address?.city}
                </Typography>
              </Box>
              <Box className="flex flex-row gap-4 items-center">
                <CallOutlinedIcon />
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
            <Box className="flex flex-row gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
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
