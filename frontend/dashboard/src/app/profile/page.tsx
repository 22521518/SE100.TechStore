'use client';

import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EmployStatusIcon from '@components/icons/employ-status-icon';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import GenderIcon from '@components/icons/gender-icon';
import PasswordIcon from '@mui/icons-material/Password';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { TMockUser } from '@providers/auth-provider';
import { useGetIdentity } from '@refinedev/core';
import React from 'react';
import { transformDate } from '@utils/transform.util';
import { generateRandomStaffList } from '@utils/random.util';
import { dummyAvatar } from '@constant/value.constant';

const ProfileShow = () => {
  const { data: identity } = useGetIdentity<TMockUser>();
  console.log(identity);
  const personalInfo = generateRandomStaffList(1)[0];
  const dummyGender = 'male';
  const dummyBirthday = '1-1-2003';

  return (
    <>
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
              {personalInfo.employee_status}
            </Typography>
            <EmployStatusIcon status={personalInfo.employee_status} />
          </Box>
        </Box>
        <Box className="flex flex-row gap-4 items-center p-2">
          <AvatarImage
            src={dummyAvatar}
            alt={personalInfo?.full_name}
            size={96}
          />
          <Stack className="justify-start gap-5">
            <Typography className="text-lg font-bold">
              {personalInfo.full_name}
            </Typography>
            <Typography className="text-lg text-slate-500 font-bold">
              ID: {personalInfo.staff_id}
            </Typography>
          </Stack>

          <Box className="flex flex-row gap-4 items-center ml-auto">
            <Typography className="text-lg flex flex-row items-center gap-3">
              <ManageAccountsOutlinedIcon /> Role:
            </Typography>
            <Typography className="text-lg">
              {personalInfo?.role?.role_name}
            </Typography>
          </Box>
        </Box>
        <Divider className="h-[1px] bg-slate-500 my-4 opacity-50" />
        <Box className="grid grid-cols-2 px-6 items-start justify-center">
          <Stack className="p-4 gap-10">
            <Box className="flex flex-row gap-2 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <BadgeOutlinedIcon />
                Full name:
              </Typography>
              <Typography className="text-lg">
                {personalInfo.full_name}
              </Typography>
            </Box>

            <Box className="flex flex-row gap-4 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <CallOutlinedIcon />
                Phone number:
              </Typography>
              <Typography className="text-lg">
                {personalInfo.phone_number}
              </Typography>
            </Box>
          </Stack>
          {/* Extra information */}
          <Stack className="p-4 gap-10">
            <Box className="flex flex-row gap-2 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <CakeOutlinedIcon />
                Birthday:
              </Typography>
              <Typography className="text-lg">{dummyBirthday}</Typography>
            </Box>
            <Box className="flex flex-row gap-2 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <GenderIcon male={dummyGender === 'male'} />
                Gender:
              </Typography>
              <Typography className="text-lg">{dummyGender}</Typography>
            </Box>
            <Box className="flex flex-row gap-4 items-center">
              <Typography className="text-lg flex flex-row items-center gap-3">
                <DateRangeOutlinedIcon />
                Hire date:
              </Typography>
              <Typography className="text-lg">
                {(() => {
                  const date = personalInfo.hire_date
                    ? new Date(personalInfo.hire_date)
                    : new Date();
                  return <span>{transformDate(date.toISOString())}</span>;
                })()}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CommonContainer>
      <CommonContainer className="w-full">
        <Box className="flex flex-row items-center gap-2">
          <AccountCircleOutlinedIcon className="text-3xl" />
          <Typography className="text-2xl font-bold">
            Account Information
          </Typography>
        </Box>

        <Box className="grid grid-cols-2 px-6 items-start justify-center py-8">
          <Box className="flex flex-row gap-4 items-center">
            <Typography className="text-lg flex flex-row items-center gap-3">
              <AlternateEmailIcon />
              Email:
            </Typography>
            <Typography className="text-lg">
              {personalInfo.account?.email}
            </Typography>
          </Box>
          <Box className="flex flex-row gap-4 items-center">
            <Typography className="text-lg flex flex-row items-center gap-3">
              <PasswordIcon />
              Password:
            </Typography>
            <Typography className="text-lg">
              ******************************
            </Typography>
          </Box>
        </Box>
      </CommonContainer>
    </>
  );
};

export default ProfileShow;
