'use client';

import CommonContainer from '@components/common-container';
import { IStaff } from '@constant/interface.constant';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useForm, useNavigation, useResourceParams } from '@refinedev/core';
import React from 'react';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
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
import { DeleteButton, EditButton } from '@refinedev/mui';
import { EMPLOY_STATUS } from '@constant/enum.constant';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const StaffShow = () => {
  const { id } = useResourceParams();
  const { query, onFinish } = useForm<IStaff>({
    resource: 'staff',
    action: 'edit',
    id: id,
    redirect: false
  });
  const record = query?.data?.data;

  const [staffValue, setStaffValue] = React.useState<IStaff>({
    staff_id: record?.staff_id || '',
    full_name: record?.full_name || '',
    phone_number: record?.phone_number || '',
    hire_date: record?.hire_date || '',
    role: record?.role || { role_id: -1, role_name: '', description: '' },
    account_id: record?.account_id || '',
    employee_status: record?.employee_status,
    account: record?.account || { email: '' },
    male: record?.male || false,
    birth_date: record?.birth_date || new Date('2003-01-01')
  });

  const [status, setStatus] = React.useState(staffValue.employee_status);

  const updateStaffStatus = React.useCallback(async () => {
    const newStatus =
      status === EMPLOY_STATUS.ACTIVE
        ? EMPLOY_STATUS.SUSPENDED
        : EMPLOY_STATUS.ACTIVE;
    setStatus(newStatus);

    const newStaff = {
      ...staffValue,
      employee_status: newStatus
    };
    try {
      await onFinish(newStaff);
      setStaffValue(newStaff);
    } catch (error) {
      console.log(error);
    }
  }, [status, staffValue, onFinish]);

  React.useEffect(() => {
    if (record) {
      setStaffValue({
        staff_id: record?.staff_id || '',
        full_name: record?.full_name || '',
        phone_number: record?.phone_number || '',
        hire_date: record?.hire_date || '',
        role: record?.role || { role_id: -1, role_name: '', description: '' },
        account_id: record?.account_id || '',
        employee_status: record?.employee_status,
        account: record?.account || { email: '' },
        male: record?.male || false,
        birth_date: record?.birth_date || new Date('2003-01-01'),
        image: record?.image || ''
      });
    }
  }, [record]);

  return (
    <Stack className="gap-4 xl:px-32 px-20 h-full justify-center">
      <CommonContainer className="w-full">
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
              {staffValue.employee_status}
            </Typography>
            <EmployStatusIcon status={staffValue.employee_status} />
          </Box>
        </Box>
        <Box className="flex flex-row gap-4 items-center p-2">
          <AvatarImage
            src={staffValue.image || dummyAvatar}
            alt={staffValue?.full_name}
            size={96}
          />
          <Stack className="justify-start gap-5">
            <Typography className="text-lg font-bold">
              {staffValue.full_name}
            </Typography>
            <Typography className="text-lg text-secondary-100 font-bold">
              ID: {staffValue.staff_id}
            </Typography>
          </Stack>
        </Box>
        <Divider className="h-[1px] bg-slate-500 my-4 opacity-50" />
        <Box className="grid grid-cols-1 lg:grid-cols-2 px-6 items-start justify-center">
          <Stack className="p-4 gap-10">
            <Box className="flex flex-row gap-6 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <BadgeOutlinedIcon />
                Full name:
              </Typography>
              <Typography className="text-lg">
                {staffValue.full_name}
              </Typography>
            </Box>
            <Box className="flex flex-row gap-4 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <ManageAccountsOutlinedIcon /> Role:
              </Typography>
              <Typography className="text-lg">
                {staffValue.role?.role_name}
              </Typography>
            </Box>

            <Box className="flex flex-row gap-4 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <AlternateEmailIcon />
                Email:
              </Typography>
              <Typography className="text-lg">
                {staffValue.account?.email}
              </Typography>
            </Box>
            <Box className="flex flex-row gap-4 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <CallOutlinedIcon />
                Phone number:
              </Typography>
              <Typography className="text-lg">
                {staffValue.phone_number}
              </Typography>
            </Box>
          </Stack>
          {/* Extra information */}
          <Stack className="p-4 gap-10">
            <Box className="flex flex-row gap-6 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <CakeOutlinedIcon className="text-lg" />
                Birthday:
              </Typography>
              <Typography className="text-lg">
                {staffValue.birth_date
                  ? transformDate(staffValue.birth_date.toString())
                  : 'N/A'}
              </Typography>
            </Box>
            <Box className="flex flex-row gap-6 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <GenderIcon male={staffValue.male || false} />
                Gender:
              </Typography>
              <Typography className="text-lg">
                {staffValue.male ? 'Male' : 'Female'}
              </Typography>
            </Box>
            <Box className="flex flex-row gap-4 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <DateRangeOutlinedIcon />
                Hire date:
              </Typography>

              <Typography className="text-lg">
                {(() => {
                  const date = staffValue.hire_date
                    ? new Date(staffValue.hire_date)
                    : new Date();
                  return <span>{transformDate(date.toISOString())}</span>;
                })()}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CommonContainer>

      <CommonContainer className="gap-4 justify-end flex flex-row w-full">
        {staffValue.employee_status === EMPLOY_STATUS.ACTIVE ? (
          <Button
            id="suspend"
            className="gap-2 bg-accent text-white lg:py-2.5 lg:px-6 min-w-max border-solid border-[2px] border-white outline-2 outline-accent outline md:text-base md:py-1.5 md:px-4"
            onClick={updateStaffStatus}
          >
            <DeleteOutlinedIcon />
            <Typography className="font-boldmd:inline-block max-sm:hidden">
              Suspend
            </Typography>
          </Button>
        ) : (
          <Button
            id="activate"
            className="gap-2 bg-accent text-white lg:py-2.5 lg:px-6 min-w-max border-solid border-2 border-white outline-2 outline-accent outline md:text-base md:py-1.5 md:px-4 max-sm:hidden"
            onClick={updateStaffStatus}
          >
            <CheckCircleOutlinedIcon />
            <Typography className="font-bold md:inline-block max-sm:hidden">
              Activate
            </Typography>
          </Button>
        )}

        <Button className="gap-2 bg-accent text-white py-2 px-4 min-w-max overflow-hidden relative">
          <EditButton className="w-full h-full absolute top-0 left-0 opacity-0" />
          <EditOutlinedIcon />
          <Typography className="font-bold">Edit</Typography>
        </Button>

        <Button className="gap-2 bg-accent text-white py-2 px-4 min-w-max relative overflow-hidden ">
          <DeleteButton
            className="w-full h-full absolute top-0 left-0 opacity-0"
            recordItemId={staffValue.staff_id}
          />
          <BlockOutlinedIcon />
          <Typography className="font-bold">Remove</Typography>
        </Button>
      </CommonContainer>
    </Stack>
  );
};

export default StaffShow;
