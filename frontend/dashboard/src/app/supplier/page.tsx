'use client';

import CommonContainer from '@components/common-container';
import SearchBar from '@components/searchbar';
import { ISupplier } from '@constant/interface.constant';
import AddIcon from '@mui/icons-material/Add';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigation } from '@refinedev/core';
import { useDataGrid } from '@refinedev/mui';
import React from 'react';
import SupplierCreate from './create/page';
import { DeleteForever } from '@mui/icons-material';

const SupplierList = () => {
  const { show } = useNavigation();
  const [query, setQuery] = React.useState('');
  const [supplierCreateModal, setSupplierCreateModal] = React.useState(false);
  const { dataGridProps } = useDataGrid<ISupplier>({
    resource: `supplier?q=${query}&`,
    pagination: {
      mode: 'server'
    }
  });
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
      }
    ],
    []
  );

  const searchSupplierHandle = async (q: string) => {
    setQuery(q);
  };

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
            {...dataGridProps}
            getRowId={(row) => row.supplier_id}
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

      {supplierCreateModal && (
        <div className="bg-slate-700 bg-opacity-75 absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden">
          <Box className="w-2/5 h-[80%]">
            <SupplierCreate
              onCancel={() => {
                setSupplierCreateModal(false);
              }}
            />
          </Box>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
