'use client';

import { Box } from '@mui/material';
import React from 'react';

import Typography from '@mui/material/Typography';
import SearchBar from '@components/searchbar';
import { ICustomer } from '@constant/interface.constant';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigation } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { transformDate } from '@utils/transform.util';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import AvatarImage from '@components/avatar';
import { dummyAvatar } from '@constant/value.constant';
import CommonContainer from '@components/common-container';

const CustomerList = () => {
  const { show } = useNavigation();
  const { dataGridProps } = useDataGrid<ICustomer>();

  const columns = React.useMemo<GridColDef<ICustomer>[]>(
    () => [
      {
        field: 'customer_id',
        headerName: 'ID',
        type: 'string',
        flex: 3
      },
      {
        field: 'image',
        headerName: 'Image',
        minWidth: 32,
        flex: 2,
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
        field: 'username',
        headerName: 'Username',
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
        flex: 3
      },
      {
        field: 'date_joined',
        headerName: 'Created at',
        flex: 3,
        renderCell: ({ row }) => {
          const date = row.date_joined ? new Date(row.date_joined) : new Date();
          return <span>{transformDate(date.toISOString(), true)}</span>;
        }
      }
    ],
    []
  );

  const searchCustomerHandle = async (query: string) => {
    console.log('searchCustomerHandle', query);
  };

  return (
    <>
      <div className="pb-4 px-2">
        <CommonContainer className="">
          <Box className="flex flex-row justify-between items-center">
            <Box className="flex flex-row items-center gap-2">
              <SentimentSatisfiedAltOutlinedIcon className="text-2xl" />
              <Typography variant="h2" className="text-2xl font-bold">
                Customers
              </Typography>
              <SearchBar title="Customer" handleSubmit={searchCustomerHandle} />
            </Box>
          </Box>
          <Box className="flex flex-col">
            <DataGrid
              {...dataGridProps}
              getRowId={(row) => row.customer_id}
              onCellClick={(cell) => {
                if (cell.field !== 'actions') {
                  show('customers', cell.row.customer_id);
                }
              }}
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
          </Box>
        </CommonContainer>
      </div>
    </>
  );
};

export default CustomerList;

function generateCustomers(loop: number): ICustomer[] {
  const customers: ICustomer[] = [];

  for (let i = 0; i < loop; i++) {
    customers.push({
      customer_id: `customer-${i + 1}`,
      account_id: `account-${i + 1}`,
      username: `user${i + 1}`,
      full_name: `Customer Full Name ${i + 1}`,
      phone_number: `+1234567890${i}`,
      date_joined: new Date().toISOString()
    });
  }

  return customers;
}
