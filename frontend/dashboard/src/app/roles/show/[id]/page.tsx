'use client';

import ButtonAction from '@components/button/button-action';
import CommonContainer from '@components/common-container';
import CommonToolTip from '@components/tooltip';
import { IPermission, IRole } from '@constant/interface.constant';
import { Box, Typography } from '@mui/material';
import { useForm, useNavigation } from '@refinedev/core';
import { generateRandomPermission } from '@utils/random.util';
import React from 'react';

const RoleShow = () => {
  const { show, edit, list } = useNavigation();

  const { query, formLoading } = useForm<IRole>({
    resource: 'roles',
    action: 'clone'
  });

  const record = query?.data?.data;
  const roleValue = React.useMemo<IRole>(() => {
    return {
      role_id: record?.role_id || -1,
      role_name: record?.role_name || '',
      description: record?.description || '',
      role_permissions: record?.role_permissions || []
    };
  }, [record]);

  const staffList = React.useMemo(() => {
    return record?.staff || [];
  }, [record]);

  const handleRoleEdit = () => {
    if (roleValue.role_id) {
      edit('roles', roleValue.role_id);
    } else {
      list('roles');
    }
  };

  const handleStaffClick = (staff_id: string) => {
    if (staff_id) {
      show('staff', staff_id);
    }
  };
  if (formLoading) return <div>Loading...</div>;
  return (
    <Box className="grid grid-cols-5 h-full overflow-hidden py-2">
      <CommonContainer
        className="col-span-3 flex flex-col gap-2 h-[100%] overflow-hidden"
        heightMin={false}
        heightMax={false}
      >
        <Box className="flex flex-row justify-between items-center mb-4">
          <Typography variant="h4" className="text-xl font-bold">
            Role Information
          </Typography>
          <ButtonAction className="text-sm px-2" onClick={handleRoleEdit}>
            Edit
          </ButtonAction>
        </Box>
        <Box className="grid grid-cols-2 gap-2">
          <Typography>
            <b>Role Name:</b> {roleValue.role_name}
          </Typography>
          <Typography>
            <b>Role ID:</b> {roleValue.role_id}
          </Typography>
          <Typography className="col-span-2">
            <b>Description:</b> {roleValue.description}
          </Typography>
        </Box>
        <Typography variant="h4" className="mt-4 text-xl font-bold">
          Permissions
        </Typography>
        <Box className="grid grid-cols-2 gap-2 h-full">
          {roleValue.role_permissions &&
          roleValue.role_permissions.length > 0 ? (
            <ol className="h-[55%] grid grid-cols-3 col-span-2 px-2 overflow-y-scroll">
              {roleValue.role_permissions.map((permission) => (
                <li
                  className="ms-5 py-3 list-disc"
                  key={permission.permission_id}
                >
                  <CommonToolTip title={permission.description}>
                    <Typography>{permission.permission_name}</Typography>
                  </CommonToolTip>
                </li>
              ))}
            </ol>
          ) : (
            <Typography className="text-opacity-50 italic col-span-2 flex items-center justify-center">
              Role has no permissions
            </Typography>
          )}
        </Box>
      </CommonContainer>
      <CommonContainer
        className="col-span-2 h-[100%] overflow-hidden"
        heightMin={false}
        heightMax={false}
      >
        <Typography variant="h4" className="mb-4 text-xl font-bold">
          Staffs {`(Total: ${staffList.length})`}
        </Typography>
        <Box className="grid grid-cols-10 border-b-[1px] border-opacity-50 border-secondary-300 mb-1 pb-1 pe-6 sticky top-0">
          <Typography className="col-span-1">No.</Typography>
          <Typography className="col-span-3">Full Name</Typography>
          <Typography className="col-span-6 text-end">ID</Typography>
        </Box>
        <ul className="px-2 relative h-full overflow-y-scroll">
          {staffList.map((staff, index) => (
            <li
              key={staff.staff_id}
              className="hover:bg-opacity-80 hover:bg-secondary-200 gap-3"
              onClick={() => handleStaffClick(staff.staff_id || '')}
            >
              <CommonToolTip
                title={staff.full_name}
                className="grid grid-cols-12 hover:bg-opacity-50 cursor-pointer py-1"
              >
                <Typography className="col-span-1">{index + 1}</Typography>
                <Typography className="col-span-4 overflow-hidden " noWrap>
                  {staff.full_name}
                </Typography>
                <Typography
                  className="col-span-7 text-end overflow-hidden"
                  noWrap
                >
                  {staff.staff_id}
                </Typography>
              </CommonToolTip>
            </li>
          ))}
        </ul>
      </CommonContainer>
    </Box>
  );
};

export default RoleShow;
