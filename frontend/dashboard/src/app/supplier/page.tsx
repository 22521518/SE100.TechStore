'use client';

import CommonContainer from '@components/common-container';
import SearchBar from '@components/searchbar';
import { ISupplier } from '@constant/interface.constant';
import AddIcon from '@mui/icons-material/Add';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigation } from '@refinedev/core';
import { DeleteButton, useDataGrid } from '@refinedev/mui';
import React from 'react';
import SupplierCreate from './create/page';
import { DeleteForever } from '@mui/icons-material';
import SupplierEdit from './edit/[id]/page';
import DeleteIcon from '@mui/icons-material/Delete';

const SupplierList = () => {
  const [query, setQuery] = React.useState('');
  const [supplierCreateModal, setSupplierCreateModal] = React.useState(false);
  const [supplier, setSupplier] = React.useState<ISupplier | null>(null);
  const { dataGridProps } = useDataGrid<ISupplier>({
    resource: `supplier?q=${query}&`,
    pagination: {
      mode: 'server'
    }
  });
  const {
    paginationMode,
    paginationModel,
    onPaginationModelChange,
    ...restDataGridProps
  } = dataGridProps;
  const [rowsDatagrid, setRowsDatagrid] = React.useState<ISupplier[]>([
    ...dataGridProps.rows
  ]);
  const [flag, setFlag] = React.useState(true);
  const columns = React.useMemo<GridColDef<ISupplier>[]>(
    () => [
      {
        field: 'supplier_id',
        headerName: 'ID',
        type: 'string',
        flex: 1
      },
      {
        field: 'supplier_name',
        headerName: 'Name',
        flex: 3
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 4
      },
      {
        field: 'contact_number',
        headerName: 'Phone Number',
        flex: 3
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 3
      },
      {
        field: 'actions',
        headerName: '',
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Button className="text-accent overflow-hidden">
              <DeleteIcon />
              <DeleteButton
                className="absolute top-0 left-0 opacity-0"
                recordItemId={row.supplier_id}
                onSuccess={() => {
                  setRowsDatagrid((prev) =>
                    [...prev].filter((r) => r.supplier_id !== row.supplier_id)
                  );
                }}
              />
            </Button>
          );
        }
      }
    ],
    []
  );

  const searchSupplierHandle = async (q: string) => {
    setQuery(q);
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
    <div className="pb-4 px-2">
      <CommonContainer>
        <Box className="flex flex-row justify-between items-center">
          <Box className="flex flex-row items-center gap-2">
            <SearchBar title="Supplier" handleSubmit={searchSupplierHandle} />
            <SentimentSatisfiedAltOutlinedIcon className="text-2xl" />
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
                Suppliers
              </Typography>
            )}
          </Box>
          <Button
            className="bg-accent text-secondary-100 font-bold px-4 py-2"
            onClick={() => setSupplierCreateModal(true)}
          >
            <AddIcon />
            Add Supplier
          </Button>
        </Box>

        <Box className="flex flex-col">
          <DataGrid
            {...restDataGridProps}
            columns={columns}
            rows={rowsDatagrid}
            getRowId={(row: ISupplier) => row.supplier_id || 0}
            pagination
            paginationMode={paginationMode}
            paginationModel={paginationModel}
            onPaginationModelChange={(model, details) => {
              onPaginationModelChange &&
                onPaginationModelChange(model, details);
              setFlag(true);
            }}
            onCellClick={(cell) => {
              if (cell.field !== 'actions') {
                setSupplier(cell.row as ISupplier);
              }
            }}
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

      {supplierCreateModal && (
        <div className="bg-slate-700 bg-opacity-75 absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden">
          <Box className="w-2/5 h-[80%]">
            <SupplierCreate
              onSuccessfulSubmit={(supplierResponse) => {
                setRowsDatagrid((prev) => [...prev, supplierResponse]);
                console.log(supplierResponse);
              }}
              onCancel={() => {
                setSupplierCreateModal(false);
              }}
            />
          </Box>
        </div>
      )}
      {supplier && (
        <div className="bg-slate-700 bg-opacity-75 absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden">
          <Box className="w-2/5 h-[80%]">
            <SupplierEdit
              onSuccessfulEdit={(supplierResponse) => {
                setRowsDatagrid((prev) => {
                  return prev.map((s) => {
                    if (s.supplier_id === supplierResponse.supplier_id) {
                      return supplierResponse;
                    }
                    return s;
                  });
                });
              }}
              supplier={supplier}
              onCancel={() => {
                setSupplier(null);
              }}
            />
          </Box>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
