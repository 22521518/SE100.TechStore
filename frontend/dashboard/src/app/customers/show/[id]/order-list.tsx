'use client';

import { IOrder } from '@constant/interface.constant';
import CommonContainer from '@components/common-container';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import OrderStatusTag from '@components/tags/order-status-tag';
import { transformVNMoney } from '@utils/transform.util';

type CustomerOrderListProps = {
  orderList: IOrder[];
};

const CustomerOrderList = ({ orderList }: CustomerOrderListProps) => {
  const columns = React.useMemo<GridColDef<IOrder>[]>(
    () => [
      {
        field: 'order_id',
        headerName: 'Order ID',
        type: 'string',
        flex: 2
      },
      {
        field: 'order_status',
        headerName: 'Status',
        flex: 2,
        renderCell: ({ value }) => {
          return (
            <Box className="flex items-center justify-center h-full">
              <OrderStatusTag status={value} />
            </Box>
          );
        }
      },
      {
        field: 'total_price',
        headerName: 'Total Price',
        flex: 3,
        renderCell: ({ value }) => {
          return (
            <Typography className="h-full text-sm flex items-center">
              {transformVNMoney(Number(value))}
            </Typography>
          );
        }
      },
      {
        field: 'created_at',
        headerName: 'Date',
        flex: 2,
        renderCell: ({ row }) => {
          const date = new Date(row.created_at);
          const formattedDate = date.toLocaleDateString('en-US');
          return <span>{formattedDate}</span>;
        }
      }
    ],
    []
  );
  return (
    <CommonContainer>
      <Box className="flex flex-row justify-between">
        <Box className="flex flex-row gap-1">
          <LocalGroceryStoreOutlinedIcon />
          <Typography variant="h4" className="font-bold text-xl">
            Orders History
          </Typography>
        </Box>
        <Typography
          variant="h4"
          className="font-semibold text-lg text-slate-500"
        >
          Total {orderList.length} orders
        </Typography>
      </Box>
      <DataGrid
        columns={columns}
        rows={orderList}
        getRowId={(row: IOrder) => row.order_id}
        sx={{
          color: 'black',
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

export default CustomerOrderList;
