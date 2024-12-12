'use client';

import ButtonAction from '@components/button/button-action';
import CommonContainer from '@components/common-container';
import { IPermission, IRole } from '@constant/interface.constant';
import { Box, Checkbox, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useList, useNavigation } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import RadarIcon from '@mui/icons-material/Radar';
import React from 'react';
import { DeleteForever } from '@mui/icons-material';
import SearchBar from '@components/searchbar';

const RoleShow = () => {
  const { create, show } = useNavigation();

  const { data: permissionsList } = useList<IPermission>({
    resource: 'permissions'
  });
  const [query, setQuery] = React.useState('');
  const { dataGridProps } = useDataGrid<IRole>();

  const permissions = React.useMemo<IPermission[]>(() => {
    return permissionsList?.data || [];
  }, [permissionsList]);

  const columns = React.useMemo<GridColDef<IRole>[]>(
    () => [
      {
        field: 'role_id',
        headerName: 'ID',
        type: 'string',
        flex: 1
      },
      {
        field: 'role_name',
        headerName: 'Name',
        flex: 5
      },
      {
        field: 'staff',
        headerName: 'Staff',
        flex: 5,
        renderCell: ({ row }) => {
          return (
            <Typography className="h-full flex items-center">
              {row.staff?.length}
            </Typography>
          );
        }
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 5
      }
    ],
    []
  );
  const onCreateClick = React.useCallback(() => {
    create('roles');
  }, [create]);

  const searchRoleHandle = async (q: string) => {
    setQuery(q);
  };
  return (
    <CommonContainer className="h-full flex flex-col gap-4  w-full py-4">
      <Box className="flex items-center gap-4 justify-between mx-4">
        <Box className="flex flex-row items-center gap-2 px-2">
          <SearchBar title="Role" handleSubmit={searchRoleHandle} />
          <RadarIcon className="text-lg" />
          {query ? (
            <>
              <Typography variant="h2" className="text-lg font-bold">
                Search Result: {query}
              </Typography>
              <DeleteForever
                className="text-lg hover:cursor-pointer"
                onClick={() => setQuery('')}
              />
            </>
          ) : (
            <Typography variant="h2" className="text-lg font-bold">
              Role List
            </Typography>
          )}
        </Box>

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
