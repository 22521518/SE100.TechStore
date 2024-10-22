'use client';

import CommonContainer from '@components/common-container';
import { IStaff } from '@constant/interface.constant';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useForm, useNavigation } from '@refinedev/core';
import React from 'react';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { generateRandomStaffList } from '@utils/random.util';
import AvatarImage from '@components/avatar';
import { dummyAvatar } from '@constant/value.constant';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import GenderIcon from '@components/icons/gender-icon';
import { transformDate } from '@utils/transform.util';
import EmployStatusIcon from '@components/icons/employ-status-icon';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';

const StaffShow = () => {
  const { edit } = useNavigation();
  const { query, formLoading, onFinish } = useForm<IStaff>({
    resource: 'staff',
    action: 'edit',
    redirect: 'show'
  });
  const record = query?.data?.data;
  const staffInfo = record || generateRandomStaffList(1)[0];
  const dummyGender = 'male';
  const dummyBirthday = '1-1-2003';

  const [staffValue, setStaffValue] = React.useState<IStaff>({
    staff_id: staffInfo.staff_id,
    full_name: staffInfo.full_name,
    phone_number: staffInfo.phone_number,
    hire_date: staffInfo.hire_date,
    role: staffInfo.role,
    account: staffInfo.account,
    employee_status: staffInfo.employee_status
  });

  React.useEffect(() => {
    if (record) {
      setStaffValue({
        staff_id: record.staff_id,
        full_name: record.full_name,
        phone_number: record.phone_number,
        hire_date: record.hire_date,
        role: record.role,
        account: record.account,
        employee_status: record.employee_status
      });
    }
  }, [record]);

  if (formLoading) return <div>Loading...</div>;
  return (
    <Stack className="gap-4">
      <CommonContainer>
        <Box className="flex flex-row justify-between items-center p-3">
          <Box className="flex flex-row items-center gap-2">
            <PermIdentityOutlinedIcon className="text-3xl" />
            <Typography className="text-2xl font-bold">
              Personal Information
            </Typography>
          </Box>
          <Box className="flex flex-row gap-4 items-center">
            <Typography className="text-xl font-bold">Status:</Typography>
            <Typography className="text-lg">
              {staffInfo.employee_status}
            </Typography>
            <EmployStatusIcon status={staffInfo.employee_status} />
          </Box>
        </Box>
        <Box className="flex flex-row gap-4 items-center p-2">
          <AvatarImage src={dummyAvatar} alt={staffInfo?.full_name} size={96} />
          <Stack className="justify-start gap-5">
            <Typography className="text-3xl font-bold">
              {staffInfo.full_name}
            </Typography>
            <Typography className="text-xl text-slate-500 font-bold">
              ID: {staffInfo.staff_id}
            </Typography>
          </Stack>
        </Box>
        <Divider className="h-[1px] bg-slate-500 my-4 opacity-50" />
        <Box className="grid grid-cols-2 px-6 items-start justify-center">
          <Stack className="p-4 gap-10">
            <Box className="flex flex-row gap-6 items-center">
              <BadgeOutlinedIcon className="text-2xl" />
              <Typography className="text-2xl">
                {staffInfo.full_name}
              </Typography>
            </Box>
            <Box className="flex flex-row gap-4 items-center">
              <ManageAccountsOutlinedIcon className="text-2xl" />
              <Typography className="text-2xl">
                {staffInfo?.role?.role_name}
              </Typography>
            </Box>

            <Box className="flex flex-row gap-4 items-center">
              <AlternateEmailIcon className="text-2xl" />
              <Typography className="text-2xl">
                {staffInfo.account.email}
              </Typography>
            </Box>
            <Box className="flex flex-row gap-4 items-center">
              <CallOutlinedIcon className="text-2xl" />
              <Typography className="text-2xl">
                {staffInfo.phone_number}
              </Typography>
            </Box>
          </Stack>
          {/* Extra information */}
          <Stack className="p-4 gap-10">
            <Box className="flex flex-row gap-6 items-center">
              <CakeOutlinedIcon className="text-2xl" />
              <Typography className="text-2xl">{dummyBirthday}</Typography>
            </Box>
            <Box className="flex flex-row gap-6 items-center">
              <GenderIcon male={dummyGender === 'male'} />
              <Typography className="text-2xl">{dummyGender}</Typography>
            </Box>
            <Box className="flex flex-row gap-4 items-center">
              <DateRangeOutlinedIcon className="text-2xl" />
              <Typography className="text-2xl">
                {(() => {
                  const date = staffInfo.hire_date
                    ? new Date(staffInfo.hire_date)
                    : new Date();
                  return <span>{transformDate(date.toISOString())}</span>;
                })()}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CommonContainer>

      <CommonContainer className="gap-4 justify-end flex flex-row">
        <Button
          className="gap-2 bg-accent text-white py-2 px-4 min-w-max"
          onClick={() => edit('staff', staffInfo?.staff_id || '')}
          disabled={formLoading || !staffInfo?.staff_id}
        >
          <EditOutlinedIcon />
          <Typography className="font-bold">Edit</Typography>
        </Button>

        <Button className="gap-2 bg-accent text-white py-2 px-4 min-w-max">
          <BlockOutlinedIcon />
          <Typography className="font-bold">Remove</Typography>
        </Button>
      </CommonContainer>
    </Stack>
  );
};

export default StaffShow;
