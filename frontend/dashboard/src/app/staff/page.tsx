'use client';

import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import SearchBar from '@components/searchbar';
import { IStaff } from '@constant/interface.constant';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDataGrid } from '@refinedev/mui';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import React from 'react';
import { useNavigation } from '@refinedev/core';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { DeleteForever } from '@mui/icons-material';

const StaffList = () => {
  const { create, show } = useNavigation();
  const [query, setQuery] = React.useState('');
  const { dataGridProps } = useDataGrid<IStaff>({
    resource: `staff?q=${query}&`,
    pagination: {
      mode: 'server'
    }
  });
  const columns = React.useMemo<GridColDef<IStaff>[]>(
    () => [
      {
        field: 'staff_id',
        headerName: 'ID',
        type: 'string',
        flex: 2
      },
      {
        field: 'image',
        headerName: 'Image',
        minWidth: 32,
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Box className="flex h-full items-center justify-center">
              <AvatarImage
                src={row.image || dummyAvatar}
                alt={row.full_name}
                size={32}
              />
            </Box>
          );
        }
      },
      {
        field: 'full_name',
        headerName: 'Full Name',
        flex: 3
      },
      {
        field: 'account',
        headerName: 'Email',
        flex: 4,
        renderCell: ({ row }) => {
          return (
            <Typography className="h-full flex items-center">
              {row.account?.email}
            </Typography>
          );
        }
      },
      {
        field: 'phone_number',
        headerName: 'Phone Number',
        flex: 2
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 3,
        renderCell: ({ row }) => {
          return (
            <Typography className="h-full flex items-center">
              {row.role?.role_name || 'No role assigned'}
            </Typography>
          );
        }
      },
      {
        field: 'male',
        headerName: 'Gender',
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Typography className="h-full flex items-center">
              {row.male ? 'Male' : 'Female'}
            </Typography>
          );
        }
      },
      {
        field: 'employee_status',
        headerName: 'Status',
        flex: 2,
        renderCell: ({ value }) => {
          return (
            <Box className="flex items-center justify-center h-full">
              <Typography className="text-sm capitalize">{value}</Typography>
            </Box>
          );
        }
      }
    ],
    []
  );

  const searchStaffHandle = async (q: string) => {
    setQuery(q);
  };

  return (
    <CommonContainer className="flex flex-col">
      <Box className="flex flex-row justify-between items-center min-h-max">
        <Box className="flex flex-row items-center gap-2 px-2">
          <SearchBar title="Staff" handleSubmit={searchStaffHandle} />
          <SupportAgentOutlinedIcon className="text-lg" />
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
              Staff
            </Typography>
          )}
        </Box>
        <Button
          className="bg-accent text-secondary-100 font-bold px-4 py-2 gap-2"
          onClick={() => create('staff')}
        >
          <PersonAddAltOutlinedIcon />
          Add Staff
        </Button>
      </Box>
      <DataGrid
        {...dataGridProps}
        getRowId={(row) => row.staff_id}
        onCellClick={(cell) => show('staff', cell.row.staff_id)}
        columns={columns}
        sx={{
          color: 'black',
          fontSize: '14px',
          '& .MuiDataGrid-row': {
            '&:nth-of-type(odd)': {
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          },
          '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]':
            {
              backgroundColor: 'transparent !important',
              color: 'black'
            }
        }}
        className="text-accent my-4"
      />
    </CommonContainer>
  );
};

export default StaffList;
