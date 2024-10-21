'use client';

import { CustomerFormValues } from '@app/customers/customer.interface';
import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import { IAccount, IAddress, ICustomer } from '@constant/constant.interface';
import { Box, Button, Stack, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FaceIcon from '@mui/icons-material/Face';
import KeyIcon from '@mui/icons-material/Key';
import CallIcon from '@mui/icons-material/Call';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { HttpError, useForm } from '@refinedev/core';
import React from 'react';

const CustomerShow = () => {
  const { query, formLoading, onFinish } = useForm<
    ICustomer,
    HttpError,
    CustomerFormValues
  >();
  const record = query?.data?.data;

  const { query: addressQuery, formLoading: addressLoading } = useForm<
    IAccount,
    HttpError
  >({
    resource: 'addresses',
    action: 'edit',
    id: record?.customer_id || 'default-customer-id'
  });

  const addressList = generateRandomAddresses(5);

  const totalSpending = 0;
  const [customerValue, setCustomerValue] = React.useState<ICustomer>({
    customer_id: record?.customer_id || 'default-customer-id',
    username: record?.username || 'default_username',
    full_name: record?.full_name || 'Default Full Name',
    phone_number: record?.phone_number || '+10000000000',
    date_joined: record?.date_joined || new Date().toISOString(),
    account: record?.account || { email: 'default@example.com' }
  });

  React.useEffect(() => {
    setCustomerValue({
      customer_id: record?.customer_id || 'default-customer-id',
      username: record?.username || 'default_username',
      full_name: record?.full_name || 'Default Full Name',
      phone_number: record?.phone_number || '+10000000000',
      date_joined: record?.date_joined || new Date().toISOString(),
      account: record?.account || { email: 'default@example.com' }
    });
  }, [record]);

  return (
    <>
      <Stack className="gap-4">
        <CommonContainer>
          <Stack>
            {/* Intro */}
            <Box className="flex flex-row justify-between border-b-2 border-slate-200 border-solid pb-6">
              <Box className="flex flex-row gap-3">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="avatar"
                />
                <Stack>
                  <Typography variant="h3" className="text-2xl font-bold">
                    {customerValue.username}
                  </Typography>
                  <Typography variant="body1" className="text-slate-400">
                    {customerValue.customer_id}
                  </Typography>
                </Stack>
              </Box>
              <Box className="flex flex-row gap-4 items-center">
                <Button className="text-white bg-accent min-w-12 px-7 h-max w-max py-3 flex flex-row gap-1">
                  <RemoveCircleIcon />
                  <Typography variant="caption">Delete</Typography>
                </Button>
                <Button className="text-white bg-accent min-w-12 px-7 h-max w-max py-3 flex flex-row gap-1">
                  <KeyIcon className="p-0" />
                  <Typography variant="caption" className="p-0">
                    Lock
                  </Typography>
                </Button>
              </Box>
            </Box>
            {/* Information */}
            <Box className="grid grid-cols-2">
              <Box className="grid grid-cols-2 border-e-2 border-slate-200 border-solid ">
                <Stack className="p-4 gap-4">
                  <Box className="flex flex-row gap-4 items-center">
                    <FaceIcon />
                    <Typography variant="body1">
                      {customerValue.full_name}
                    </Typography>
                  </Box>
                  <Box className="flex flex-row gap-4 items-center">
                    <AlternateEmailIcon />
                    <Typography variant="body1">
                      {customerValue.account.email}
                    </Typography>
                  </Box>
                  <Box className="flex flex-row gap-4 items-center">
                    <CallIcon />
                    <Typography variant="body1">
                      {customerValue.phone_number}
                    </Typography>
                  </Box>
                </Stack>
                {/* GENDER & things */}
                <Stack className="p-4 gap-4">
                  <Box className="flex flex-row gap-4 items-center">
                    <FaceIcon />
                    <Typography variant="body1">
                      {customerValue.full_name}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              {/* Address */}
              <Stack className="gap-4 p-4">
                {addressList.map((address, index) => (
                  <Box key={index} className="flex flex-row gap-3">
                    <HouseOutlinedIcon />
                    <Typography variant="caption" className="text-slate-500">
                      {address.address}, {address.state}, {address.city}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </CommonContainer>
        <CommonContainer>
          <Box className="flex flex-row justify-between px-4 py-2">
            <Box className="flex flex-row gap-4 items-center h-full">
              <LocalAtmOutlinedIcon className="text-4xl" />
              <Typography variant="h4" className="text-2xl font-bold">
                Total Spening
              </Typography>
            </Box>
            <Typography variant="h4" className="text-2xl font-bold">
              ${totalSpending.toFixed(2)}
            </Typography>
          </Box>
        </CommonContainer>
      </Stack>
    </>
  );
};

export default CustomerShow;

const getRandomItem = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const generateRandomAddresses = (count: number): IAddress[] => {
  const streets = [
    'Main St',
    'Oak St',
    'Maple Ave',
    'Pine Rd',
    'Cedar Blvd',
    'Elm St',
    'Park Ave',
    '5th Ave',
    'Sunset Blvd',
    'River Rd'
  ];
  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose'
  ];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];

  const randomAddresses: IAddress[] = [];

  for (let i = 0; i < count; i++) {
    const address = `${Math.floor(Math.random() * 9999) + 1} ${getRandomItem(
      streets
    )}`;
    const city = getRandomItem(cities);
    const state = getRandomItem(states);

    randomAddresses.push({ address, city, state });
  }

  return randomAddresses;
};
