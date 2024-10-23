'use client';

import CommonContainer from '@components/common-container';
import { EMPLOY_STATUS } from '@constant/enum.constant';
import { IStaffInfo } from '@constant/interface.constant';
import {
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Select,
  InputLabel,
  Button
} from '@mui/material';
import { useForm, useNavigation } from '@refinedev/core';
import { generateRandomRoleList } from '@utils/random.util';
import React from 'react';

const StaffCreate = () => {
  const { list } = useNavigation();
  const { onFinish } = useForm<IStaffInfo>();

  const roleList = generateRandomRoleList(5);
  const [birthdate, setBirthdate] = React.useState<Date>(new Date(Date.now()));
  const [staffValue, setStaffValue] = React.useState<IStaffInfo>({
    full_name: '',
    phone_number: '',
    hire_date: new Date(Date.now()),
    role: undefined,
    account: {
      email: '',
      password: ''
    },
    employee_status: EMPLOY_STATUS.INACTIVE
  });
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const isPasswordMatch = React.useCallback(() => {
    return validatePassword(staffValue.account.password, confirmPassword);
  }, [staffValue.account.password, confirmPassword]);

  const validatePassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // await onFinish(staffValue);
      console.log(staffValue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-row w-full h-full items-center justify-center">
      <CommonContainer className="py-12 px-10 w-1/2 h-1/2 min-h-max">
        <Stack className="gap-4">
          <Typography variant="h1" className="text-2xl font-bold">
            Add New Staff
          </Typography>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Box className="grid grid-cols-2 gap-6 items-center">
              <FormControl>
                <TextField
                  type="text"
                  id="full_name"
                  label="Full Name"
                  name="full_name"
                  value={staffValue.full_name}
                  onChange={(e) =>
                    setStaffValue({ ...staffValue, full_name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl className="flex flex-row gap-2 items-center">
                <RadioGroup
                  aria-labelledby="radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  className="flex flex-row gap-4 items-center"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box className="grid grid-cols-2 gap-6 items-center">
              <FormControl>
                <TextField
                  type="tel"
                  id="phone_number"
                  label="Phone Number"
                  name="phone_number"
                  value={staffValue.phone_number}
                  onChange={(e) =>
                    setStaffValue({
                      ...staffValue,
                      phone_number: e.target.value
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <TextField
                  type="date"
                  id="hire_date"
                  label="Hire Date"
                  name="hire_date"
                  value={
                    new Date(staffValue.hire_date).toISOString().split('T')[0]
                  }
                  onChange={(e) =>
                    setStaffValue({ ...staffValue, hire_date: e.target.value })
                  }
                />
              </FormControl>
            </Box>
            <Box className="grid grid-cols-2 gap-6 items-center">
              <FormControl>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  label="Role"
                  value={staffValue.role?.role_id || '-1'}
                  onChange={(e) => {
                    setStaffValue({
                      ...staffValue,
                      role:
                        roleList.find(
                          (role) => role.role_id === e.target.value
                        ) || undefined
                    });
                  }}
                >
                  <MenuItem value="-1" className="text-slate-400">
                    <em>None</em>
                  </MenuItem>
                  {roleList.map((role) => (
                    <MenuItem key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <TextField
                  type="date"
                  id="birth_date"
                  label="Birthdate"
                  name="birth_date"
                  value={new Date(birthdate).toISOString().split('T')[0]}
                  onChange={(e) => setBirthdate(new Date(e.target.value))}
                />
              </FormControl>
            </Box>
            <TextField
              type="email"
              id="email"
              label="Email"
              name="email"
              value={staffValue.account.email}
              onChange={(e) =>
                setStaffValue({
                  ...staffValue,
                  account: { ...staffValue.account, email: e.target.value }
                })
              }
            />
            <TextField
              type="password"
              id="password"
              label="Password"
              name="password"
              value={staffValue.account.password}
              onChange={(e) =>
                setStaffValue({
                  ...staffValue,
                  account: { ...staffValue.account, password: e.target.value }
                })
              }
            />
            <TextField
              type="password"
              id="confirm-password"
              label="Confirm Password"
              name="confirm password"
              error={!isPasswordMatch()}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <FormControl>
              <InputLabel id="employee-status-select-label">
                Employee Status
              </InputLabel>
              <Select
                labelId="employee-status-select-label"
                id="employee-status-select"
                label="Employee Status"
                value={staffValue.employee_status}
                onChange={(e) =>
                  setStaffValue({
                    ...staffValue,
                    employee_status: e.target.value as EMPLOY_STATUS
                  })
                }
              >
                <MenuItem value={EMPLOY_STATUS.ACTIVE}>Active</MenuItem>
                <MenuItem value={EMPLOY_STATUS.INACTIVE}>Inactive</MenuItem>
              </Select>
            </FormControl>
            <Box className="grid grid-cols-2 gap-6 items-center">
              <Button
                className="rounded-lg font-bold py-3 border-accent border-2 border-solid text-accent"
                onClick={() => list('staff')}
              >
                Cancel
              </Button>
              <Button
                className="rounded-lg font-bold py-3 bg-accent text-white"
                type="submit"
              >
                Save
              </Button>
            </Box>
          </form>
        </Stack>
      </CommonContainer>
    </div>
  );
};

export default StaffCreate;
