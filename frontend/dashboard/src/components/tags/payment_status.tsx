'use client';

import { PAYMENT_STATUS } from '@constant/enum.constant';
import { Box } from '@mui/material';
import React from 'react';

type PaymentStatusTagProps = {
  status: PAYMENT_STATUS;
};

const PaymentStatusTag = ({ status }: PaymentStatusTagProps) => {
  const PaymentStatusColors = {
    PENDING: '#FF9800',
    PAID: '#8BC34A',
    REFUNDED: '#CCCCCC',
    CANCELLED: '#F44336'
  };

  return (
    <Box
      className="flex items-center justify-center px-2 py-1 rounded-lg text-white w-max h-max text-sm min-w-24"
      sx={{
        backgroundColor: PaymentStatusColors[status]
      }}
    >
      <p>{status}</p>
    </Box>
  );
};

export default PaymentStatusTag;
