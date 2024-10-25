'use client';
import { IOrderItem } from '@constant/interface.constant';
import { Box, Stack } from '@mui/system';
import Image from 'next/image';
import React from 'react';
import { dummyProductImage } from '@constant/value.constant';
import { Typography } from '@mui/material';
import { transformVNMoney } from '@utils/transform.util';

type ProductCardProps = {
  orderItem: IOrderItem;
};

const ProductCard = ({ orderItem }: ProductCardProps) => {
  const productInfo = orderItem.product;
  return (
    <Box className="flex flex-row justify-around items-center">
      <Box className="flex flex-row  gap-1">
        <Image
          src={productInfo?.images ? productInfo?.images[0] : dummyProductImage}
          alt={productInfo?.product_name || 'product'}
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
        />
        <Stack className="justify-between">
          <Typography className="text-lg font-medium">
            {productInfo?.product_name || 'product'}
          </Typography>
          <Typography className="text-secondary-100">
            {transformVNMoney(orderItem.unit_price || 0)}
          </Typography>
        </Stack>
      </Box>
      <Typography>x {orderItem.quantity || 'product'}</Typography>
    </Box>
  );
};

export default ProductCard;
