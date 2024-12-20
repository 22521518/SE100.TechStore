'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

type DashBoardStatCardProps = {
  title: string;
  value: string;
  icon: React.ReactElement;
};

const DashBoardStatCard = ({ title, value, icon }: DashBoardStatCardProps) => {
  return (
    <>
      <Box className="bg-white gap-2 grid grid-cols-4 items-center place-items-center px-3 py-1 rounded-lg shadow-md">
        {React.cloneElement(icon, {
          className: 'text-5xl bg-secondary-200 bg-opacity-50 rounded-full p-1'
        })}

        <Box className="grid grid-rows-5 col-span-3 items-center ">
          <Typography className="row-span-2 lg:inline-block  sm:inline-block md:hidden">
            {title}
          </Typography>
          <Typography className="row-span-3 text-xl font-bold">
            {value}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default DashBoardStatCard;
