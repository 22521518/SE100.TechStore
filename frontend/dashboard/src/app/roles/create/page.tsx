'use client';

import CommonContainer from '@components/common-container';
import { IPermission, IRole } from '@constant/interface.constant';
import { CheckBox } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography
} from '@mui/material';
import { useForm, useList, useNavigation } from '@refinedev/core';
import React from 'react';
import { PermissionCheckType } from '../permission-check.type';
import ButtonAction from '@components/button/button-action';
import CommonToolTip from '@components/tooltip';
import { generateRandomPermission } from '@utils/random.util';

const RoleCreate = () => {
  const { list } = useNavigation();

  const { data: permissionsList } = useList<IPermission>({
    resource: 'permissions'
  });
  const permissions = React.useMemo<IPermission[]>(() => {
    return permissionsList?.data || [];
  }, [permissionsList]);

  const { onFinish } = useForm<IRole>();

  const [roleCheck, setRoleCheck] = React.useState<PermissionCheckType[]>(
    permissions.map((permission) => {
      return {
        permission,
        checked: false
      };
    })
  );

  const [roleValue, setRoleValue] = React.useState<IRole>({
    role_name: '',
    description: '',
    role_permissions: []
  });

  const handleCancelClick = () => list('roles');

  const handlePermissionCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRoleCheck((prev) =>
      prev.map((p) => {
        if (p.permission.permission_id === name) {
          return { ...p, checked: checked };
        }
        return p;
      })
    );
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await onFinish(roleValue);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setRoleCheck(
      permissions.map((permission) => {
        return {
          permission,
          checked: false
        };
      })
    );
  }, [permissions]);

  React.useEffect(() => {
    setRoleValue((prev) => ({
      ...prev,
      role_permissions: roleCheck
        .filter((p) => p.checked)
        .map((p) => p.permission)
    }));
  }, [roleCheck]);

  return (
    <div className="flex place-content-center h-[100%] w-full overflow-hidden">
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-8 gap-1 h-[100%] justify-center w-11/12 items-center"
      >
        <CommonContainer
          className="flex flex-col col-span-2 overflow-hidden w-full h-[92%]"
          heightMin={false}
          heightMax={false}
        >
          <FormControl
            sx={{
              '& .MuiFormLabel-root.Mui-focused': {
                color: 'inherit'
              }
            }}
            className="h-[100%] w-full relative flex items-center justify-around"
          >
            <FormLabel className="mx-2">Permissions</FormLabel>
            <FormGroup className="flex flex-row overflow-y-scroll overflow-x-hidden -ms-4 h-[90%] left-4 relative">
              {permissions &&
                permissions.map((permission) => {
                  return (
                    <FormControlLabel
                      key={permission.permission_id}
                      className="w-full"
                      control={
                        <Checkbox
                          checked={
                            roleCheck.find(
                              (p) =>
                                p.permission.permission_id ===
                                permission.permission_id
                            )?.checked
                          }
                          onChange={handlePermissionCheck}
                          name={permission.permission_id}
                        />
                      }
                      label={permission.permission_name}
                    />
                  );
                })}
            </FormGroup>
          </FormControl>
        </CommonContainer>

        <CommonContainer
          className="flex flex-col col-span-4 gap-4 min-h-max h-[92%]"
          heightMin={false}
          heightMax={false}
        >
          <Typography variant="h4" className="text-center">
            Create Role
          </Typography>
          <FormControl>
            <FormLabel className="mx-2">Role ID</FormLabel>
            <TextField type="text" value={roleValue.role_id} disabled />
          </FormControl>
          <FormControl>
            <FormLabel className="mx-2">Role Name</FormLabel>
            <TextField
              type="text"
              value={roleValue.role_name}
              onChange={(e) =>
                setRoleValue((prev) => {
                  return { ...prev, role_name: e.target.value };
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel className="mx-2">Description</FormLabel>
            <TextField
              type="text"
              value={roleValue.description}
              multiline
              rows={8}
              onChange={(e) =>
                setRoleValue((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }
            />
          </FormControl>
          <Box className="grid grid-cols-2 gap-4 items-center mt-auto">
            <ButtonAction type="submit" className="w-full">
              Create
            </ButtonAction>
            <ButtonAction
              type="button"
              className="w-full"
              onClick={handleCancelClick}
            >
              Cancel
            </ButtonAction>
          </Box>
        </CommonContainer>

        <CommonContainer
          className="flex flex-col col-span-2 overflow-hidden w-full h-[92%]"
          heightMin={false}
          heightMax={false}
        >
          <Box
            sx={{
              '& .MuiFormLabel-root.Mui-focused': {
                color: 'inherit'
              }
            }}
            className="flex flex-col h-[100%] w-full relative justify-around"
          >
            <Typography className="mx-2 font-bold">
              Permissions{' '}
              {`(total: ${
                roleCheck.filter((checkedPer) => checkedPer.checked).length
              })`}
            </Typography>
            <ul className="flex flex-col overflow-y-scroll overflow-x-hidden -ms-4 h-[90%] left-4 relative">
              {permissions &&
                roleCheck
                  .filter((checkedPer) => checkedPer.checked)
                  .map(({ permission }) => {
                    return (
                      <li
                        className="ms-5 list-disc"
                        key={permission.permission_id}
                      >
                        <CommonToolTip title={permission.description}>
                          <Typography>{permission.permission_name}</Typography>
                        </CommonToolTip>
                      </li>
                    );
                  })}
            </ul>
          </Box>
        </CommonContainer>
      </form>
    </div>
  );
};

export default RoleCreate;
