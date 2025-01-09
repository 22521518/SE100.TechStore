'use client';

import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import { ICustomer } from '@constant/interface.constant';
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
import CustomerOrderList from './order-list';
import { transformVNMoney } from '@utils/transform.util';
import { dummyAvatar } from '@constant/value.constant';

const CustomerShow = () => {
  const { query, formLoading } = useForm<ICustomer, HttpError>({
    resource: 'customers',
    action: 'clone'
  });
  const record = query?.data?.data;

  const [customerValue, setCustomerValue] = React.useState<ICustomer>({
    customer_id: record?.customer_id || '',
    account_id: record?.account_id || '',
    username: record?.username || '',
    full_name: record?.full_name || '',
    phone_number: record?.phone_number || '',
    date_joined: record?.date_joined || '',
    account: record?.account || { email: '' },
    product_feedbacks: record?.product_feedbacks || [],
    orders: record?.orders || [],
    addresses: record?.addresses || [],
    image: record?.image || '',
    male: record?.male,
    birth_date: record?.birth_date
  });

  const totalSpending = customerValue.orders?.reduce((acc, order) => {
    acc += Number(order.total_price);
    return acc;
  }, 0);

  const dummyBirthday = '1-1-1900';

  React.useEffect(() => {
    setCustomerValue({
      customer_id: record?.customer_id || '',
      account_id: record?.account_id || '',
      username: record?.username || '',
      full_name: record?.full_name || '',
      phone_number: record?.phone_number || '',
      date_joined: record?.date_joined || '',
      account: record?.account || { email: '' },
      product_feedbacks: record?.product_feedbacks || [],
      orders: record?.orders || [],
      addresses: record?.addresses || [],
      image: record?.image || '',
      male: record?.male,
      birth_date: record?.birth_date
    });
  }, [record]);

  if (formLoading) {
    return (
      <div>
        Loading... {formLoading},{' '}
        {record ? JSON.stringify(record) : 'no record'},
      </div>
    );
  }

  return (
    <>
      <Stack className="gap-4">
        <CommonContainer>
          <Stack>
            {/* Intro */}
            <Box className="flex flex-row justify-between border-b-2 border-slate-200 border-solid pb-6">
              <Box className="flex flex-row gap-3">
                <AvatarImage
                  src={customerValue.image || dummyAvatar}
                  alt="avatar"
                />
                <Stack>
                  <Typography variant="h3" className="text-2xl font-bold">
                    {customerValue.username}
                  </Typography>
                  <Typography variant="body1" className="text-black">
                    {customerValue.customer_id}
                  </Typography>
                </Stack>
              </Box>
              {/* <Box className="flex flex-row gap-4 items-center">
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
              </Box> */}
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
                      {customerValue.account?.email}
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
                    <GenderIcon male={customerValue.male ? true : false} />
                    <Typography variant="body1">
                      {customerValue ? 'Male' : 'Female'}
                    </Typography>
                  </Box>
                  <Box className="flex flex-row gap-4 items-center">
                    <CakeOutlinedIcon />
                    <Typography variant="body1">
                      {new Date(
                        customerValue.birth_date || dummyBirthday
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              {/* Address */}
              <Stack className="gap-4 p-4">
                {customerValue.addresses?.map((address, index) => (
                  <Box key={index} className="flex flex-row gap-3 items-center">
                    <HouseOutlinedIcon />
                    <Typography variant="caption" className="text-black">
                      {address.address}, {address.district}, {address.city}
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
                Total Spending
              </Typography>
            </Box>
            <Typography variant="h4" className="text-3xl font-bold">
              {transformVNMoney(totalSpending || 0)}
            </Typography>
          </Box>
        </CommonContainer>
        <Box className="flex flex-row gap-1 w-full">
          {customerValue.product_feedbacks && (
            <CustomerFeedbackList
              feedbackList={customerValue.product_feedbacks}
            />
          )}
          {customerValue.orders && (
            <CustomerOrderList orderList={customerValue.orders} />
          )}
        </Box>
      </Stack>
    </>
  );
};

export default CustomerShow;
