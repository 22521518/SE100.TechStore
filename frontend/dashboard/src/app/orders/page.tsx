'use client';

import React from 'react';
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
  Stack,
  Typography
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDataGrid } from '@refinedev/mui';
import { transformVNMoney, transformDate } from '@utils/transform.util';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { ORDER_STATUS, PAYMENT_STATUS } from '@constant/enum.constant';
import OrderShow from './show/[id]/page';
import SearchBar from '@components/searchbar';

type OrderCustomerId = {
  order_id: string;
  customer_id: string;
};

const OrderList = () => {
  const orderStatusList = [
    'ALL',
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED
  ];

  const paymentStatusList = [
    'ALL',
    PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.PAID,
    PAYMENT_STATUS.REFUNDED,
    PAYMENT_STATUS.CANCELLED
  ];

  const [filter, setFilter] = React.useState({
    orderStatus: orderStatusList[0].toUpperCase(),
    paymentStatus: paymentStatusList[0].toUpperCase()
  });

  const [orderQuery, setOrderQuery] = React.useState('');
  const SearchCategorySubmit = async (query: string) => {
    setOrderQuery(query);
  };

  const handleOrderStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setFilter({
      ...filter,
      orderStatus: event.target.value as string
    });
  };

  const [orderIdDetail, setOrderIdDetail] = React.useState<OrderCustomerId>();
  const { dataGridProps } = useDataGrid<IOrder>({
    resource: `orders?q=${orderQuery}&order_status=${
      filter.orderStatus.toUpperCase() === 'ALL'
        ? ''
        : filter.orderStatus.toUpperCase()
    }&payment_status=${
      filter.paymentStatus.toUpperCase() === 'ALL'
        ? ''
        : filter.paymentStatus.toUpperCase()
    }`,
    pagination: {
      pageSize: 10,
      mode: 'client'
    }
  });
  const {
    paginationMode,
    paginationModel,
    onPaginationModelChange,
    ...restDataGridProps
  } = dataGridProps;
  const [rowsDatagrid, setRowsDatagrid] = React.useState<IOrder[]>([
    ...dataGridProps.rows
  ]);
  const [flag, setFlag] = React.useState(true);

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

  const onUpdateOrderStatus = (order: IOrder) => {
    setRowsDatagrid((prev) => {
      return prev.map((item) => {
        if (item.order_id === order.order_id) {
          return order;
        }
        return item;
      });
    });
  };

  React.useEffect(() => {
    if (flag && dataGridProps.rows.length !== 0) {
      setRowsDatagrid([...dataGridProps.rows]);
    }
    if (rowsDatagrid.length !== 0) {
      setFlag(false);
    }
  }, [dataGridProps.rows, rowsDatagrid, flag]);

  return (
    <Box className="grid grid-cols-5 h-full gap-2">
      <CommonContainer className="col-span-3">
        <Box className="flex flex-row justify-between items-center">
          <Stack gap={2}>
            <Box className="flex flex-row gap-2 px-4 items-center">
              <SearchBar title="Order" handleSubmit={SearchCategorySubmit} />
              <AssignmentOutlinedIcon className="font-bold text-3xl" />
              {orderQuery ? (
                <>
                  <Typography variant="h2" className="text-lg font-bold">
                    Search Result: {orderQuery} {`(${dataGridProps.rowCount})`}
                  </Typography>
                  <DeleteForeverIcon
                    className="text-2xl hover:cursor-pointer"
                    onClick={() => setOrderQuery('')}
                  />
                </>
              ) : (
                <Typography variant="h4" className="font-bold text-lg">
                  Orders
                </Typography>
              )}
            </Box>
            <FormControl
              className="min-w-max max-w-max px-4"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
            >
              <InputLabel
                id="sort-by-label"
                variant="standard"
                className="mix-w-max max-w-max forced-colors:to-black"
              >
                Filter status:
              </InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by-select"
                value={filter.orderStatus}
                onChange={handleOrderStatusFilterChange}
                label="Sort by"
                className="rounded-sm border-none min-w-max"
              >
                {orderStatusList.map((item, index) => (
                  <MenuItem key={index} value={item.toUpperCase()}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
        <DataGrid
          {...dataGridProps}
          rows={rowsDatagrid}
          columns={columns}
          getRowId={(row: IOrder) => row.order_id}
          pagination
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          onPaginationModelChange={(model, details) => {
            onPaginationModelChange && onPaginationModelChange(model, details);
            setFlag(true);
          }}
          onCellClick={(cell) => {
            if (cell.field !== 'actions')
              setOrderIdDetail({
                order_id: cell.row.order_id,
                customer_id: cell.row.customer_id
              });
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
          className="text-accent xl:min-h-[630px]"
        />
      </CommonContainer>
      <Box className="col-span-2">
        <OrderShow
          onUpdateOrderStatus={onUpdateOrderStatus}
          orderId={orderIdDetail?.order_id}
          customerId={orderIdDetail?.customer_id}
        />
      </Box>
    </Box>
  );
};

export default OrderList;
