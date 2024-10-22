'use client';

import { ORDER_STATUS } from '@constant/enum.constant';
import { Box } from '@mui/material';
import React from 'react';

type OrderStatusTagProps = {
  status: ORDER_STATUS;
};

const OrderStatusTag = ({ status }: OrderStatusTagProps) => {
  const orderStatusColors = {
    PENDING: '#FF9800',
    CONFIRMED: '#4CAF50',
    SHIPPED: '#2196F3',
    DELIVERED: '#8BC34A',
    CANCELLED: '#F44336'
  };

  return (
    <Box
      className="flex items-center justify-center px-2 py-1 rounded-lg text-white w-max h-max text-sm min-w-24"
      sx={{
        backgroundColor: orderStatusColors[status]
      }}
    >
      <p>{status}</p>
    </Box>
  );
};

export default OrderStatusTag;
