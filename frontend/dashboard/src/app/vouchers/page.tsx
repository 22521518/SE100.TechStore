'use client';

import { IVoucher } from '@constant/interface.constant';
import { Box, Button, Typography } from '@mui/material';
import { useNavigation } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import { generateRandomVoucher } from '@utils/random.util';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { transformDate } from '@utils/transform.util';
import VoucherStatusTag from '@components/tags/voucher-staus-tag';
import CommonContainer from '@components/common-container';
import SearchBar from '@components/searchbar';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import VoucherCreate from './create/page';
import VoucherEdit from './edit/[id]/page';

const VoucherList = () => {
  const { edit, create, show } = useNavigation();
  const voucherFake = generateRandomVoucher(10);
  const { dataGridProps } = useDataGrid<IVoucher>();
  const columns = React.useMemo<GridColDef<IVoucher>[]>(
    () => [
      {
        field: 'voucher_code',
        headerName: 'CODE',
        type: 'string',
        flex: 3
      },
      {
        field: 'voucher_name',
        headerName: 'Name',
        flex: 2
      },
      {
        field: 'is_active',
        headerName: 'Status',
        flex: 2,
        renderCell: ({ value }) => {
          return (
            <Box className="flex items-center justify-center h-full">
              <VoucherStatusTag status={value} />
            </Box>
          );
        }
      },
      {
        field: 'discount_amount',
        headerName: 'Discount',
        flex: 1,
        renderCell: ({ value }) => {
          return (
            <span className="h-full text-center justify-center">{value}%</span>
          );
        }
      },
      {
        field: 'valid_from',
        headerName: 'From',
        flex: 2,
        renderCell: ({ row }) => {
          const date = new Date(row.valid_from);
          return <span>{transformDate(date.toISOString())}</span>;
        }
      },
      {
        field: 'valid_to',
        headerName: 'To',
        flex: 2,
        renderCell: ({ row }) => {
          const date = new Date(row.valid_to);
          return <span>{transformDate(date.toISOString())}</span>;
        }
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 4
      }
    ],
    []
  );

  const [voucherCreateModal, setVoucherCreateModal] = React.useState(false);
  const [voucherEditModal, setVoucherEditModal] = React.useState(false);
  const [voucher, setVoucher] = React.useState<IVoucher | undefined>();

  const onCancel = React.useCallback(() => {
    setVoucherCreateModal(false);
    setVoucherEditModal(false);
  }, []);

  const onCreate = React.useCallback(() => {
    setVoucherCreateModal(true);
  }, []);

  const onEdit = React.useCallback(() => {
    setVoucherEditModal(true);
  }, []);

  const searchVoucherHandle = React.useCallback(async (query: string) => {
    console.log('searchVoucherHandle', query);
  }, []);

  return (
    <>
      <CommonContainer>
        <Box className="flex flex-row justify-between items-center">
          <Box className="flex flex-row items-center gap-2 px-2">
            <LoyaltyOutlinedIcon className="text-2xl" />
            <Typography variant="h2" className="text-2xl font-bold">
              Vouchers
            </Typography>
            <SearchBar title="Voucher" handleSubmit={searchVoucherHandle} />
          </Box>
          <Button
            className="bg-accent text-secondary-100 font-bold px-4 py-2 gap-2"
            onClick={onCreate}
          >
            <AddIcon />
            Create Voucher
          </Button>
        </Box>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          rows={voucherFake}
          getRowId={(row: IVoucher) => row.voucher_code || ''}
          onCellClick={(cell) => {
            setVoucher(cell.row as IVoucher);
            onEdit();
          }}
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
      {(voucherCreateModal || voucherEditModal) && (
        <div className="bg-slate-700 bg-opacity-75 absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden">
          <Box className="w-2/5">
            {voucherCreateModal && <VoucherCreate onCancel={onCancel} />}
            {voucherEditModal && voucher && (
              <VoucherEdit voucher={voucher} onCancel={onCancel} />
            )}
          </Box>
        </div>
      )}
    </>
  );
};

export default VoucherList;
