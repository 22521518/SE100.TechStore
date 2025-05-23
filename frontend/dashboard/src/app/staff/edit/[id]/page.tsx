'use client';

import CommonContainer from '@components/common-container';
import {
  IImage,
  IRole,
  IStaff,
  IStaffEdit
} from '@constant/interface.constant';
import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  InputLabel
} from '@mui/material';
import { useForm, useList, useNavigation } from '@refinedev/core';
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
import EmployStatusIcon from '@components/icons/employ-status-icon';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { transformDate } from '@utils/transform.util';
import { handleImage } from '@utils/image.utils';

const StaffEdit = () => {
  const { show } = useNavigation();

  const { data: getRoleList } = useList<IRole>({
    resource: 'roles'
  });
  const roleList = getRoleList?.data || [];

  const { query, formLoading, onFinish } = useForm<IStaff>({
    redirect: false,
    resource: 'staff',
    action: 'edit'
  });
  const record = query?.data?.data;

  const [image, setImage] = React.useState<IImage>({
    name: record?.full_name || '',
    url: record?.image || ''
  });

  const [staffValue, setStaffValue] = React.useState<IStaffEdit>({
    staff_id: record?.staff_id || '',
    full_name: record?.full_name || '',
    phone_number: record?.phone_number || '',
    hire_date: record?.hire_date || '',
    role: record?.role || { role_id: 0, role_name: '', description: '' },
    account_id: record?.account_id || '',
    employee_status: record?.employee_status,
    account: record?.account || { email: '' },
    male: record?.male || false,
    birth_date: record?.birth_date,
    image: { name: record?.full_name || '', url: record?.image || '' }
  });

  const changeImage = ({ name, url }: { name: string; url: string }) => {
    setImage({ name, url });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleImage(files[0], changeImage);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onFinish(staffValue);
      show('staff', staffValue.staff_id || '');
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setStaffValue((prev) => ({
      ...prev,
      image: image
    }));
  }, [image]);

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
        birth_date: record?.birth_date,
        image: { name: record?.full_name || '', url: record?.image || '' }
      });

      setImage({
        name: record?.full_name || '',
        url: record?.image || ''
      });
    }
  }, [record]);

  return (
    <Stack className="gap-4 px-2   lg:px-32 md:px-16">
      <CommonContainer>
        <Box className="flex lg:flex-row lg:justify-between items-center p-3 flex-col gap-2">
          <Box className="flex flex-row items-center gap-2">
            <PermIdentityOutlinedIcon className="text-sm md:text-lg lg:text-3xl" />
            <Typography className="text-base lg:text-2xl font-bold">
              Personal Information
            </Typography>
          </Box>
          <Box className="flex flex-row gap-4 items-center">
            <Typography className="text-base lg:text-xl font-bold">
              Status:
            </Typography>
            <Typography className="text-base lg:text-lg">
              {staffValue.employee_status}
            </Typography>
            <EmployStatusIcon status={staffValue.employee_status} />
          </Box>
        </Box>
        <Box className="flex flex-row gap-4 items-center p-2 max-sm:justify-center">
          <div className="size-[96px] overflow-hidden relative items-center justify-center group hover:opacity-50 hover:cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                zIndex: 999,
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
            />
            <EditOutlinedIcon className="absolute right-0 bottom-0 text-white bg-accent p-1 rounded-full" />
            <AvatarImage
              src={image.url || dummyAvatar}
              alt={staffValue?.full_name}
              size={96}
              className="sm:inline-block hidden max-md:min-w-12 max-md:h-12"
            />
          </div>
          <Stack className="justify-start gap-5">
            <Typography className="sm:text-base lg:text-lg font-bold">
              {staffValue.full_name}
            </Typography>
            <Typography
              className="sm:text-base lg:text-lg text-secondary-300 font-bold"
              noWrap
            >
              ID: {staffValue.staff_id}
            </Typography>
          </Stack>
        </Box>
        <Divider className="h-[1px] bg-slate-500 my-4 opacity-50" />
        <form onSubmit={onSubmit}>
          <Box className="grid lg:grid-cols-2 px-6 place-items-center  sm:grid-cols-1 w-full">
            <Stack className="p-4 gap-10 max-w-max h-full">
              <FormControl className="flex flex-row gap-6 items-center">
                <BadgeOutlinedIcon className="text-lg" />
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
                    '& .MuiInputBase-root': { fontSize: '1rem' }
                  }}
                />
              </FormControl>
              <Box className="flex flex-row gap-6 items-center">
                <ManageAccountsOutlinedIcon className="text-lg" />
                <FormControl className="min-w-max">
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    label="Role"
                    value={staffValue.role?.role_id}
                    defaultValue={staffValue.role?.role_id}
                    onChange={(e) => {
                      setStaffValue((prev) => ({
                        ...prev,
                        role: roleList?.find(
                          (role: IRole) =>
                            role.role_id === Number(e.target.value)
                        )
                      }));
                    }}
                  >
                    {roleList &&
                      roleList?.map((role: IRole) => (
                        <MenuItem key={role.role_id} value={role.role_id}>
                          {role.role_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              <FormControl className="flex flex-row gap-4 items-center">
                <AlternateEmailIcon className="text-lg" />
                <TextField
                  id="email"
                  type="email"
                  variant="standard"
                  label="Email"
                  value={staffValue.account?.email}
                  disabled
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '1rem' }
                  }}
                />
              </FormControl>
              <FormControl className="flex flex-row gap-4 items-center">
                <CallOutlinedIcon className="text-lg" />
                <TextField
                  id="phone_number"
                  type="tel"
                  variant="standard"
                  label="Phone Number"
                  value={staffValue.phone_number}
                  onChange={(e) =>
                    setStaffValue((prev) => ({
                      ...prev,
                      phone_number: e.target.value
                    }))
                  }
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '1rem' }
                  }}
                />
              </FormControl>
            </Stack>
            {/* Extra information */}
            <Stack className="p-4 gap-10 max-w-max h-full">
              <FormControl className="flex flex-row gap-6 items-center">
                <CakeOutlinedIcon className="text-lg" />
                <TextField
                  type="date"
                  variant="standard"
                  label="Birthday"
                  value={
                    staffValue.birth_date
                      ? new Date(staffValue.birth_date)
                          .toISOString()
                          .split('T')[0]
                      : new Date().toISOString().split('T')[0]
                  }
                  onChange={(e) =>
                    setStaffValue((prev) => ({
                      ...prev,
                      birth_date: new Date(e.target.value)
                    }))
                  }
                  className="text-lg"
                />
              </FormControl>
              <Box className="flex flex-row gap-6 items-center">
                <GenderIcon male={staffValue.male || false} />
                <FormControl>
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    label="Gender"
                    id="gender-select"
                    value={staffValue.male ? 'male' : 'female'}
                    className="min-w-36"
                    onChange={(e) => {
                      setStaffValue((prev) => ({
                        ...prev,
                        male: e.target.value === 'male'
                      }));
                    }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormControl className="flex flex-row gap-4 items-center">
                <DateRangeOutlinedIcon className="text-lg" />
                <TextField
                  type="text"
                  disabled
                  variant="standard"
                  label="Hire Date"
                  value={
                    staffValue.hire_date
                      ? transformDate(staffValue.hire_date.toString())
                      : 'N/A'
                  }
                  onChange={(e) => {
                    setStaffValue({
                      ...staffValue,
                      hire_date: new Date(e.target.value).toISOString()
                    });
                    setStaffValue((prev) => ({
                      ...prev,
                      hire_date: new Date(e.target.value).toISOString()
                    }));
                  }}
                  className="text-lg"
                />
              </FormControl>
            </Stack>
          </Box>
          {/* ACTION */}
          <Box className="flex flex-row items-center gap-4 py-10  w-full lg:justify-end justify-center">
            <Button
              className="gap-2 bg-accent text-white lg:py-2.5 lg:px-6 min-w-max border-solid border-2 border-white outline-2 outline-accent outline md:text-base md:py-1.5 md:px-4"
              type="submit"
            >
              <EditOutlinedIcon />
              <Typography className="font-bold md:inline-block max-sm:hidden">
                Save
              </Typography>
            </Button>
            <Button
              className="gap-2 bg-white text-accent border-solid border-2 border-white outline-2 outline outline-accent lg:py-3 lg:px-4 min-w-max md:text-sm md:py-1.5 md:px-3"
              onClick={() => show('staff', staffValue.staff_id || '')}
            >
              <CancelOutlinedIcon />
              <Typography className="font-bold md:inline-block max-sm:hidden">
                Cancel
              </Typography>
            </Button>
          </Box>
        </form>
      </CommonContainer>
    </Stack>
  );
};

export default StaffEdit;
