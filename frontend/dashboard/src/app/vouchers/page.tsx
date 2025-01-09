'use client';

import { IVoucher } from '@constant/interface.constant';
import { Box, Button, Typography } from '@mui/material';
import { useNavigation } from '@refinedev/core';
import { DeleteButton, useDataGrid } from '@refinedev/mui';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { transformDate } from '@utils/transform.util';
import VoucherStatusTag from '@components/tags/voucher-staus-tag';
import CommonContainer from '@components/common-container';
import SearchBar from '@components/searchbar';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import VoucherCreate from './create/page';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VoucherEdit from './edit/[id]/page';
import { DeleteForever } from '@mui/icons-material';

const VoucherList = () => {
  const { list } = useNavigation();
  const [query, setQuery] = React.useState('');
  const { dataGridProps } = useDataGrid<IVoucher>({
    resource: `vouchers?q=${query}&`,
    pagination: {
      mode: 'server'
    }
  });
  const [rowDatagrid, setRowDatagrid] = React.useState<IVoucher[]>([
    ...dataGridProps.rows
  ]);
  const [voucherCreateModal, setVoucherCreateModal] = React.useState(false);
  const [voucherSelect, setVoucher] = React.useState<IVoucher | undefined>();
  const [flag, setFlag] = React.useState(true);
  const {
    paginationMode,
    paginationModel,
    onPaginationModelChange,
    ...restDataGridProps
  } = dataGridProps;
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
      },
      {
        field: 'actions',
        headerName: '',
        flex: 2,
        renderCell: ({ row }) => {
          return (
            <Box className="flex flex-row gap-1 items-center justify-center h-full">
              <Button
                className="text-accent"
                onClick={() => {
                  console.log(row);
                  setVoucher(row as IVoucher);
                }}
              >
                <EditIcon />
              </Button>
              <Button className="text-accent overflow-hidden">
                <DeleteIcon />
                <DeleteButton
                  className="absolute top-0 left-0 opacity-0"
                  recordItemId={row.voucher_code}
                  onSuccess={() => {
                    setRowDatagrid((prev) => {
                      return [...prev].filter(
                        (r) => r.voucher_code !== row.voucher_code
                      );
                    });
                  }}
                />
              </Button>
            </Box>
          );
        }
      }
    ],
    []
  );

  const onCancel = React.useCallback(() => {
    setVoucherCreateModal(false);
    setVoucher(undefined);
  }, []);

  const onCreate = React.useCallback(() => {
    setVoucherCreateModal(true);
  }, []);

  const searchVoucherHandle = async (q: string) => {
    setQuery(q);
  };

  React.useEffect(() => {
    if (flag && dataGridProps.rows.length !== 0) {
      setRowDatagrid([...dataGridProps.rows]);
    }
    if (rowDatagrid.length !== 0) {
      setFlag(false);
    }
  }, [dataGridProps.rows, rowDatagrid, flag]);

  return (
    <>
      <CommonContainer className="flex flex-col">
        <Box className="flex flex-row justify-between items-center">
          <Box className="flex flex-row items-center gap-2 px-2">
            <SearchBar title="Voucher" handleSubmit={searchVoucherHandle} />
            <LoyaltyOutlinedIcon className="text-2xl" />
            {query ? (
              <>
                <Typography variant="h2" className="text-2xl font-bold">
                  Search Result: {query}
                </Typography>
                <DeleteForever
                  className="text-2xl hover:cursor-pointer"
                  onClick={() => setQuery('')}
                />
              </>
            ) : (
              <Typography variant="h2" className="text-2xl font-bold">
                Vouchers
              </Typography>
            )}
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
          rows={rowDatagrid}
          columns={columns}
          getRowId={(row: IVoucher) => row.voucher_code || ''}
          pagination
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          onPaginationModelChange={(model, details) => {
            onPaginationModelChange && onPaginationModelChange(model, details);
            setFlag(true);
          }}
          onCellClick={(cell) => {
            if (cell.field !== 'actions') setVoucher(cell.row as IVoucher);
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
      {(voucherCreateModal || voucherSelect) && (
        <Box className="bg-slate-700 bg-opacity-75 absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden">
          <Box className="w-2/5">
            {voucherCreateModal && (
              <VoucherCreate
                onCancel={onCancel}
                onSuccessfulCreate={(voucher) => {
                  setRowDatagrid((prev) => [...prev, voucher]);
                }}
              />
            )}
            {voucherSelect && (
              <VoucherEdit
                voucher={voucherSelect}
                onCancel={onCancel}
                onSuccessfulEdit={(voucher) => {
                  setRowDatagrid((prev) => {
                    return prev.map((v) => {
                      if (v.voucher_code === voucher.voucher_code) {
                        return voucher;
                      }
                      return v;
                    });
                  });
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default VoucherList;
