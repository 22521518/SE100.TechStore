'use client';

import CommonContainer from '@components/common-container';
import { IStaff } from '@constant/interface.constant';
import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useForm, useNavigation } from '@refinedev/core';
import React from 'react';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import {
  generateRandomRoleList,
  generateRandomStaffList
} from '@utils/random.util';
import AvatarImage from '@components/avatar';
import { dummyAvatar } from '@constant/value.constant';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import GenderIcon from '@components/icons/gender-icon';
import EmployStatusIcon from '@components/icons/employ-status-icon';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { EMPLOY_STATUS } from '@constant/enum.constant';

const StaffEdit = () => {
  const { show } = useNavigation();

  const roleList = generateRandomRoleList(5);

  const { query, formLoading, onFinish } = useForm<IStaff>();
  const record = query?.data?.data;
  const staffInfo = record || generateRandomStaffList(1)[0];
  const [dummyGender, setDummyGender] = React.useState('male');
  const [dummyBirthday, setDummyBirthday] = React.useState(
    new Date('2003-01-01')
  );

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
    setStaffValue({
      staff_id: record?.staff_id || staffInfo.staff_id,
      full_name: record?.full_name || staffInfo.full_name,
      phone_number: record?.phone_number || staffInfo.phone_number,
      hire_date: record?.hire_date || staffInfo.hire_date,
      role: record?.role || staffInfo.role,
      account: record?.account || staffInfo.account,
      employee_status: record?.employee_status || staffInfo.employee_status
    });
  }, [record]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await onFinish(staffValue);
      setStaffValue({
        ...staffValue,
        employee_status:
          staffValue.employee_status === EMPLOY_STATUS.ACTIVE
            ? EMPLOY_STATUS.SUSPENDED
            : EMPLOY_STATUS.ACTIVE
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
      <form onSubmit={onSubmit}>
        <Box className="grid grid-cols-2 px-6 items-start justify-center">
          <Stack className="p-4 gap-10">
            <FormControl className="flex flex-row gap-6 items-center">
              <BadgeOutlinedIcon className="text-2xl" />
              <TextField
                id="full_name"
                type="text"
                variant="standard"
                label="Full Name"
                value={staffValue.full_name}
                onChange={(e) =>
                  setStaffValue({
                    ...staffValue,
                    full_name: e.target.value
                  })
                }
                sx={{
                  '& .MuiInputBase-root': { fontSize: '1.25rem' }
                }}
              />
            </FormControl>
            <FormControl className="flex flex-row gap-4 items-center">
              <ManageAccountsOutlinedIcon className="text-2xl" />
              <Typography className="text-2xl">
                {staffValue.role?.role_name}
              </Typography>
              <Select
                labelId="role-select-label"
                id="role-select"
                label="Role"
                value={staffValue.role?.role_id}
                defaultValue={staffValue.role?.role_id}
                onChange={(e) => {
                  setStaffValue({
                    ...staffValue,
                    role: roleList.find(
                      (role) => role.role_id === e.target.value
                    )
                  });
                }}
              >
                {roleList.map((role) => (
                  <MenuItem key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="flex flex-row gap-4 items-center">
              <AlternateEmailIcon className="text-2xl" />
              <TextField
                id="email"
                type="email"
                variant="standard"
                label="Email"
                value={staffInfo.account.email}
                disabled
                sx={{
                  '& .MuiInputBase-root': { fontSize: '1.25rem' }
                }}
              />
            </FormControl>
            <FormControl className="flex flex-row gap-4 items-center">
              <CallOutlinedIcon className="text-2xl" />
              <TextField
                id="phone_number"
                type="phone"
                variant="standard"
                label="Phone Number"
                value={staffValue.phone_number}
                onChange={(e) =>
                  setStaffValue({
                    ...staffValue,
                    phone_number: e.target.value
                  })
                }
                sx={{
                  '& .MuiInputBase-root': { fontSize: '1.25rem' }
                }}
              />
            </FormControl>
          </Stack>
          {/* Extra information */}
          <Stack className="p-4 gap-10">
            <FormControl className="flex flex-row gap-6 items-center">
              <CakeOutlinedIcon className="text-2xl" />
              <TextField
                type="date"
                variant="standard"
                label="Birthday"
                value={new Date(dummyBirthday).toISOString().split('T')[0]}
                onChange={(e) =>
                  setStaffValue({
                    ...staffValue,
                    hire_date: new Date(e.target.value).toISOString()
                  })
                }
                className="text-2xl"
              />
            </FormControl>
            <FormControl className="flex flex-row gap-6 items-center">
              <GenderIcon male={dummyGender === 'male'} />
              <Select
                labelId="gender-select-label"
                id="gender-select"
                value={dummyGender}
                className="min-w-36"
                onChange={(e) => {
                  setStaffValue({
                    ...staffValue
                  });
                  setDummyGender(e.target.value);
                }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="flex flex-row gap-4 items-center">
              <DateRangeOutlinedIcon className="text-2xl" />
              <TextField
                type="date"
                disabled
                variant="standard"
                label="Hire Date"
                value={
                  (staffInfo.hire_date
                    ? new Date(staffInfo.hire_date)
                    : new Date()
                  )
                    .toISOString()
                    .split('T')[0]
                }
                onChange={(e) => {
                  setStaffValue({
                    ...staffValue,
                    hire_date: new Date(e.target.value).toISOString()
                  });
                  setDummyBirthday(new Date(e.target.value));
                }}
                className="text-2xl"
              />
            </FormControl>
          </Stack>
        </Box>
        {/* ACTION */}
        <Box className="flex flex-row items-center gap-4 py-10  w-full justify-end">
          {staffInfo.employee_status === EMPLOY_STATUS.ACTIVE ? (
            <Button
              id="suspend"
              className="gap-2 bg-accent text-white py-3 px-4 min-w-max"
              type="submit"
            >
              <DeleteOutlinedIcon />
              <Typography className="font-bold">Suspend</Typography>
            </Button>
          ) : (
            <Button
              id="activate"
              className="gap-2 bg-accent text-white py-3 px-4 min-w-max"
              type="submit"
            >
              <CheckCircleOutlinedIcon />
              <Typography className="font-bold">Activate</Typography>
            </Button>
          )}

          <Button
            className="gap-2 bg-accent text-white py-3 px-6 min-w-max"
            type="submit"
          >
            <EditOutlinedIcon />
            <Typography className="font-bold">Save</Typography>
          </Button>
          <Button
            className="gap-2 bg-white text-accent border-solid border-2 border-accent py-3 px-4 min-w-max"
            onClick={() => show('staff', staffInfo.staff_id || '')}
          >
            <CancelOutlinedIcon />
            <Typography className="font-bold">Cancel</Typography>
          </Button>
        </Box>
      </form>
    </CommonContainer>
  );
};

export default StaffEdit;
