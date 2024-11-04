'use client';

import ButtonAction from '@components/button/button-action';
import CommonContainer from '@components/common-container';
import { IPermission, IRole } from '@constant/interface.constant';
import { Box, Checkbox, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useList, useNavigation } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import React from 'react';

const RoleShow = () => {
  const { create, show } = useNavigation();

  const { data: permissionsList } = useList<IPermission>({
    resource: 'permissions'
  });

  const permissions = React.useMemo<IPermission[]>(() => {
    return permissionsList?.data || [];
  }, [permissionsList]);

  const columns = React.useMemo<GridColDef<IRole>[]>(
    () => [
      {
        field: 'role_id',
        headerName: 'ID',
        type: 'string',
        width: 50,
        flex: 1
      },
      {
        field: 'role_name',
        headerName: 'Name',
        minWidth: 100,
        maxWidth: 100,
        flex: 5
      },
      ...permissions.map((permission: IPermission) => ({
        field: permission.permission_id,
        headerName: permission.permission_name,
        flex: 3,
        minWidth: 150,
        renderCell: ({ row }: { row: IRole }) => {
          const hasPermission = row.role_permissions?.find(
            (p) => p.permission_id === permission.permission_id
          );
          return <Checkbox checked={!!hasPermission} disabled />;
        }
      }))
    ],
    [permissions]
  );
  const { dataGridProps } = useDataGrid<IPermission>();
  const onCreateClick = React.useCallback(() => {
    create('roles');
  }, [create]);

  return (
    <CommonContainer className="h-full flex flex-col gap-4  w-full py-4">
      <Box className="flex items-center gap-4 justify-between mx-4">
        <Typography variant="h4">Role List</Typography>
        <ButtonAction className="" onClick={onCreateClick}>
          <Typography>Create Role</Typography>
        </ButtonAction>
      </Box>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        estimatedRowCount={permissions.length + 3}
        getRowId={(row) => row.role_id}
        onRowClick={(_params) => {
          show('roles', _params.row.role_id);
        }}
        sx={{
          '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]':
            {
              backgroundColor: 'transparent !important',
              color: 'black'
            },
          '& .MuiDataGrid-scrollbarContent': {
            width: '100% !important'
          }
        }}
      />
    </CommonContainer>
  );
};

export default RoleShow;
