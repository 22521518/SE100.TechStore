'use client';

import CommonContainer from '@components/common-container';
import SearchBar from '@components/searchbar';
import { IImportation } from '@constant/interface.constant';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Edit, useDataGrid } from '@refinedev/mui';
import React from 'react';
import { transformDate } from '@utils/transform.util';
import ImportationDetail from '@components/importations/item-detail';
import ImportationCreate from './create/page';
import { useDelete, useNavigation } from '@refinedev/core';

const ImportationList = () => {
  const { mutate: deleteAction, isLoading, isError } = useDelete();

  const [importationCreateModal, setImportationCreateModal] =
    React.useState(false);

  const { dataGridProps } = useDataGrid<IImportation>({
    pagination: {
      pageSize: 10
    },
    sorters: {
      initial: [
        {
          field: 'importation_id',
          order: 'desc'
        }
      ]
    }
  });

  const { rows } = dataGridProps;
  const [importationDetail, setImportationDetail] = React.useState<
    IImportation | undefined
  >(rows[0]);

  const columns = React.useMemo<GridColDef<IImportation>[]>(
    () => [
      {
        field: 'importation_id',
        headerName: 'ID',
        flex: 1,
        type: 'number'
      },
      {
        field: 'supplier?.supplier_name',
        headerName: 'Supplier',
        flex: 2,
        type: 'string'
      },
      {
        field: 'import_date',
        headerName: 'Import Date',
        flex: 3,
        renderCell: ({ row }) => {
          const date = row.import_date ? new Date(row.import_date) : new Date();
          return <span>{transformDate(date.toISOString(), false)}</span>;
        }
      },
      {
        field: 'total_price',
        headerName: 'Total Price',
        flex: 3
      },
      {
        field: 'actions',
        headerName: '',
        flex: 2,
        renderCell: ({ row }) => {
          return (
            <Box className="flex flex-row max-w-max min-w-full justify-center items-center h-full">
              <EditIcon className="text-lg p-1 min-w-8 min-h-8 round hover:bg-slate-50 hover:cursor-pointer" />
              <DeleteIcon
                className="text-lg p-1 min-w-8 min-h-8 hover:bg-slate-50 hover:cursor-pointer"
                onClick={() =>
                  deleteAction({
                    resource: 'importations',
                    id: row.importation_id as number
                  })
                }
              />
            </Box>
          );
        }
      }
    ],
    []
  );

  const SearchImportationSubmit = async (query: string) => {
    console.log('searchImportationSubmit', query);
  };

  React.useEffect(() => {
    setImportationDetail(rows[0]);
  }, [rows]);

  if (isError) {
    console.error('Error while deleting importation');
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="grid grid-cols-5">
        <CommonContainer className="col-span-3">
          <Box>
            <Box className="flex flex-row justify-between items-center">
              <Box className="flex flex-row items-center gap-2">
                <Typography variant="h2" className="font-bold text-2xl">
                  Importations
                </Typography>
                <SearchBar
                  title="Product"
                  handleSubmit={SearchImportationSubmit}
                />
              </Box>
              <Button
                className="bg-accent text-secondary-100 font-bold px-4 py-2"
                onClick={() => setImportationCreateModal(true)}
              >
                <AddIcon />
                Add Importation
              </Button>
            </Box>
          </Box>

          <DataGrid
            {...dataGridProps}
            columns={columns}
            getRowId={(row) => row.importation_id}
            onRowClick={(row) => setImportationDetail(row.row)}
            sx={{
              '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]':
                {
                  backgroundColor: 'transparent !important',
                  color: 'black'
                }
            }}
            className="text-accent my-4 bg-transparent overflow-hidden"
          />
        </CommonContainer>

        <CommonContainer className="col-span-2">
          <Box className="flex flex-row justify-between ">
            <Typography variant="h2" className="font-bold text-2xl">
              Detail
            </Typography>

            {importationDetail && (
              <Typography variant="h6" className="my-1 italic">
                Importation ID: {importationDetail?.importation_id}
              </Typography>
            )}
          </Box>

          {importationDetail && (
            <ImportationDetail importation={importationDetail} />
          )}
        </CommonContainer>
      </div>

      {importationCreateModal && (
        <div className="bg-slate-700 bg-opacity-75 absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden">
          <Box className="w-4/5 h-[80%]">
            {importationCreateModal && (
              <ImportationCreate
                onCancel={() => setImportationCreateModal(false)}
              />
            )}
          </Box>
        </div>
      )}
    </div>
  );
};

export default ImportationList;
