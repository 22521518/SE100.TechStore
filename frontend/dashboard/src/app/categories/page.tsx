'use client';

import { ICategory } from '@constant/interface.constant';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DeleteButton, useDataGrid } from '@refinedev/mui';
import React from 'react';
import SearchBar from '@components/searchbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDelete, useNavigation } from '@refinedev/core';

type CategoryListProps = {
  newData?: ICategory;
  onEdit: (category: ICategory) => void;
  onCreate: () => void;
};

export default function CategoryList({
  onCreate,
  onEdit,
  newData
}: CategoryListProps) {
  const { show } = useNavigation();

  const [categoryQuery, setCategoryQuery] = React.useState('');

  const { dataGridProps } = useDataGrid<ICategory>({
    resource: `categories?q=${categoryQuery}&`,
    pagination: {
      mode: 'server'
    }
  });
  const [rowsDatagrid, setRowsDatagrid] = React.useState<ICategory[]>([
    ...dataGridProps.rows
  ]);
  const {
    paginationMode,
    paginationModel,
    onPaginationModelChange,
    ...restDataGridProps
  } = dataGridProps;
  const [flag, setFlag] = React.useState(true);

  const columns = React.useMemo<GridColDef<ICategory>[]>(
    () => [
      {
        field: 'category_id',
        headerName: 'ID',
        type: 'string',
        flex: 2
      },
      {
        field: 'category_name',
        headerName: 'Name',
        type: 'string',
        flex: 4
      },
      {
        field: 'description',
        headerName: 'Description',
        type: 'string',
        flex: 4
      },
      {
        field: 'actions',
        headerName: '',
        flex: 2,
        renderCell: ({ row }) => {
          return (
            <Box className="flex flex-row gap-1 items-center justify-center h-full">
              <Button className="text-accent" onClick={() => onEdit(row)}>
                <EditIcon />
              </Button>
              <DeleteButton
                hideText
                className="text-accent h-full w-full"
                recordItemId={row.category_id}
                resource="categories"
                onSuccess={() => {
                  setRowsDatagrid((prev) =>
                    [...prev].filter((r) => r.category_id !== row.category_id)
                  );
                }}
              >
                <DeleteIcon />
              </DeleteButton>
            </Box>
          );
        }
      }
    ],
    [onEdit]
  );

  const SearchCategorySubmit = async (query: string) => {
    setCategoryQuery(query);
  };

  React.useEffect(() => {
    if (newData) {
      let flag = false;
      setRowsDatagrid((prev) => {
        return [
          ...prev.map((row) => {
            if (row.category_id === newData.category_id) {
              flag = true;
              return newData;
            }
            return row;
          }),
          ...(flag ? [] : [newData])
        ];
      });
    }
  }, [newData]);

  React.useEffect(() => {
    if (flag && dataGridProps.rows.length !== 0) {
      setRowsDatagrid([...dataGridProps.rows]);
    }
    if (rowsDatagrid.length !== 0) {
      setFlag(false);
    }
  }, [dataGridProps.rows, rowsDatagrid, flag]);

  return (
    <Stack>
      <Box className="flex flex-row justify-between items-center">
        <Box className="flex flex-row items-center gap-2">
          <SearchBar title="Category" handleSubmit={SearchCategorySubmit} />
          <CategoryIcon className="text-2xl" />
          {categoryQuery ? (
            <>
              <Typography variant="h2" className="text-2xl font-bold">
                Search Result: {categoryQuery} {`(${dataGridProps.rowCount})`}
              </Typography>
              <DeleteForeverIcon
                className="text-2xl hover:cursor-pointer"
                onClick={() => setCategoryQuery('')}
              />
            </>
          ) : (
            <Typography variant="h2" className="text-2xl font-bold">
              Categories
            </Typography>
          )}
        </Box>
        <Button
          className="bg-accent text-secondary-100 font-bold px-4 py-2"
          onClick={onCreate}
        >
          <AddIcon />
          Add Category
        </Button>
      </Box>
      <DataGrid
        {...restDataGridProps}
        rows={rowsDatagrid}
        columns={columns}
        getRowId={(row) => row.category_id}
        pagination
        paginationMode={paginationMode}
        paginationModel={paginationModel}
        onPaginationModelChange={(model, details) => {
          onPaginationModelChange && onPaginationModelChange(model, details);
          setFlag(true);
        }}
        onCellClick={(cell) => {
          if (cell.field !== 'actions') {
            show('categories', cell.row.category_id);
          }
        }}
        className="text-accent my-2 bg-transparent"
        sx={{
          '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]':
            {
              backgroundColor: 'transparent !important',
              color: 'black'
            }
        }}
      />
    </Stack>
  );
}
