'use client';

import { CustomerFormValues } from '@app/customers/customer.interface';
import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import { IAccount, IAddress, ICustomer } from '@constant/interface.constant';
import { Box, Button, Stack, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import KeyIcon from '@mui/icons-material/Key';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { HttpError, useForm } from '@refinedev/core';
import React from 'react';
import GenderIcon from '@components/icons/gender-icon';
import CustomerFeedbackList from './feedback-list';
import {
  generateProductFeedback,
  generateRandomAddresses,
  generateRandomOrder
} from '@utils/random.util';
import CustomerOrderList from './order-list';
import { transformVNMoney } from '@utils/transform.util';

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
  const feedbackList = generateProductFeedback(15);
  const orderList = generateRandomOrder(10);

  const totalSpending = orderList.reduce((acc, order) => {
    acc += order.total_price;
    return acc;
  }, 0);

  const [customerValue, setCustomerValue] = React.useState<ICustomer>({
    customer_id: record?.customer_id || 'default-customer-id',
    username: record?.username || 'default_username',
    full_name: record?.full_name || 'Default Full Name',
    phone_number: record?.phone_number || '+10000000000',
    date_joined: record?.date_joined || new Date().toISOString(),
    account: record?.account || { email: 'default@example.com' }
  });

  const male = true;
  const dummyBirthday = '1-1-2003';

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
              <Box className="grid grid-cols-2 max-lg:grid-cols-1 border-e-2 border-slate-200 border-solid ">
                <Stack className="p-4 gap-6">
                  <Box className="flex flex-row gap-4 items-center">
                    <InfoOutlinedIcon />
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
                    <CallOutlinedIcon />
                    <Typography variant="body1">
                      {customerValue.phone_number}
                    </Typography>
                  </Box>
                </Stack>
                {/* GENDER & things */}
                <Stack className="p-4 gap-6">
                  <Box className="flex flex-row gap-4 items-center">
                    <GenderIcon male={male} />
                    <Typography variant="body1">
                      {male ? 'Male' : 'Female'}
                    </Typography>
                  </Box>
                  <Box className="flex flex-row gap-4 items-center">
                    <CakeOutlinedIcon />
                    <Typography variant="body1">{dummyBirthday}</Typography>
                  </Box>
                </Stack>
              </Box>
              {/* Address */}
              <Stack className="gap-4 p-4">
                {addressList.map((address, index) => (
                  <Box key={index} className="flex flex-row gap-3 items-center">
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
            <Typography variant="h4" className="text-3xl font-bold">
              {transformVNMoney(totalSpending)}
            </Typography>
          </Box>
        </CommonContainer>
        <Box className="flex flex-row gap-1 w-full">
          <CustomerFeedbackList feedbackList={feedbackList} />
          <CustomerOrderList orderList={orderList} />
        </Box>
      </Stack>
    </>
  );
};

export default CustomerShow;
