'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

type InboxBoxProps = {
  isOwner: boolean;
};

const InboxBox = ({ isOwner }: InboxBoxProps) => {
  return (
    <div className="w-full flex">
      <Box
        className={`w-max max-w-[40%] rounded-lg  p-1 px-2  ${
          isOwner ? 'ml-auto bg-slate-500' : 'bg-slate-300'
        }`}
      >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo,
        reiciendis asperiores itaque delectus excepturi in atque enim minima.
        Quae optio tempora corporis harum quis rerum. Aliquid fugit ullam
        recusandae obcaecati.
      </Box>
    </div>
  );
};

export default InboxBox;
