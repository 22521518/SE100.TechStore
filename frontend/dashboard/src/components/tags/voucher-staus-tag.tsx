'use client';

import { Box } from '@mui/material';
import React from 'react';

type VoucherStatusTagProps = {
  status: boolean;
};

const VoucherStatusTag = ({ status }: VoucherStatusTagProps) => {
  const voucherStatusColors = ['#F44336', '#2196F3'];

  return (
    <Box
      className="flex items-center justify-center px-2 py-1 rounded-lg text-white w-max h-max text-sm min-w-24"
      sx={{
        backgroundColor: voucherStatusColors[+status]
      }}
    >
      <p>{status ? 'ACTIVE' : 'INACTIVE'}</p>
    </Box>
  );
};

export default VoucherStatusTag;
