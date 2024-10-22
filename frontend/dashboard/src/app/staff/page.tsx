'use client';

import AvatarImage from '@components/avatar';
import CommonContainer from '@components/common-container';
import SearchBar from '@components/searchbar';
import { IStaff } from '@constant/interface.constant';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDataGrid } from '@refinedev/mui';
import { generateRandomStaffList } from '@utils/random.util';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import React from 'react';
import { useNavigation } from '@refinedev/core';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

const StaffList = () => {
  const { create, edit, show } = useNavigation();
  const { dataGridProps } = useDataGrid<IStaff>();
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
        flex: 2,
        renderCell: ({ row }) => {
          return (
            <Box className="flex h-full items-center justify-center">
              <AvatarImage src={dummyAvatar} alt={row.full_name} size={32} />
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
              {row.account.email}
            </Typography>
          );
        }
      },
      {
        field: 'phone_number',
        headerName: 'Phone Number',
        flex: 3
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 2,
        renderCell: ({ row }) => {
          return (
            <Typography className="h-full flex items-center">
              {row.role?.role_name}
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

  const searchStaffHandle = async (query: string) => {
    console.log('searchStaffHandle', query);
  };

  return (
    <CommonContainer>
      <Box className="flex flex-row justify-between items-center">
        <Box className="flex flex-row items-center gap-2 px-2">
          <SupportAgentOutlinedIcon className="text-2xl" />
          <Typography variant="h2" className="text-2xl font-bold">
            Staff
          </Typography>
          <SearchBar title="Staff" handleSubmit={searchStaffHandle} />
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
        rows={generateRandomStaffList(10)}
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
          }
        }}
        className="text-accent my-4"
      />
    </CommonContainer>
  );
};

export default StaffList;
