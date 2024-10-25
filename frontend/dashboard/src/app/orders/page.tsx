'use client';

import CommonContainer from '@components/common-container';
import OrderStatusTag from '@components/tags/order-status-tag';
import { IOrder } from '@constant/interface.constant';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDataGrid } from '@refinedev/mui';
import { generateRandomOrder } from '@utils/random.util';
import { transformVNMoney, transformDate } from '@utils/transform.util';
import React from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { ORDER_STATUS } from '@constant/enum.constant';
import OrderShow from './show/[id]/page';

const OrderList = () => {
  const filterList = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED
  ];
  const [filter, setFilter] = React.useState({
    search: filterList[0].toLowerCase()
  });
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter({
      ...filter,
      search: event.target.value as string
    });
  };
  const { dataGridProps } = useDataGrid<IOrder>();
  const [dummyOrders, setDummyOrder] = React.useState<IOrder[]>(
    generateRandomOrder(10)
  );
  const [orderDetail, setOrderDetail] = React.useState<IOrder | null>(null);

  const columns = React.useMemo<GridColDef<IOrder>[]>(
    () => [
      {
        field: 'order_id',
        headerName: 'Order ID',
        type: 'string',
        flex: 2
      },
      {
        field: 'customer_id',
        headerName: 'Customer ID',
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
          return <span>{transformDate(formattedDate)}</span>;
        }
      }
    ],
    []
  );
  return (
    <Box className="grid grid-cols-5 h-full gap-2">
      <CommonContainer className="col-span-3">
        <Box className="flex flex-row justify-between items-center">
          <Box className="flex flex-row gap-2 px-4 items-center">
            <AssignmentOutlinedIcon className="font-bold text-3xl" />
            <Typography variant="h4" className="font-bold text-2xl">
              Orders
            </Typography>
          </Box>
          <FormControl
            className="min-w-max "
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
          >
            <InputLabel
              id="sort-by-label"
              variant="standard"
              className="mix-w-max"
            >
              Filter status:
            </InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by-select"
              value={filter.search}
              onChange={handleFilterChange}
              label="Sort by"
              className="rounded-sm border-none min-w-max"
            >
              {filterList.map((item, index) => (
                <MenuItem key={index} value={item.toLowerCase()}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <DataGrid
          // {...dataGridProps}
          columns={columns}
          rows={dummyOrders}
          getRowId={(row: IOrder) => row.order_id}
          onCellClick={(cell) => {
            const order = dummyOrders.find(
              (order) => order.order_id === cell.row.order_id
            );
            setOrderDetail(order || null);
          }}
          sx={{
            color: 'black',
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
      <Box className="col-span-2">
        <OrderShow order={orderDetail} />
      </Box>
    </Box>
  );
};

export default OrderList;
