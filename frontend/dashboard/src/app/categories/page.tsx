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
import { useDataGrid } from '@refinedev/mui';
import React from 'react';
import SearchBar from '@components/searchbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigation } from '@refinedev/core';

type CategoryListProps = {
  onEdit: (category: ICategory) => void;
  onCreate: () => void;
};

export default function CategoryList({ onCreate, onEdit }: CategoryListProps) {
  const { show } = useNavigation();

  const [categoryQuery, setCategoryQuery] = React.useState('');

  const { dataGridProps } = useDataGrid<ICategory>({
    resource: `categories?q=${categoryQuery}&`,
    pagination: {
      mode: 'server'
    }
  });

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
        flex: 3,
        renderCell: ({ row }) => {
          return (
            <Box className="flex flex-row gap-1 items-center justify-center h-full">
              <Button className="text-accent" onClick={() => onEdit(row)}>
                <EditIcon />
              </Button>
              <Button className="text-accent" onClick={() => handleDelete(row)}>
                <DeleteIcon />
              </Button>
            </Box>
          );
        }
      }
    ],
    []
  );

  const SearchCategorySubmit = async (query: string) => {
    setCategoryQuery(query);
  };

  const handleDelete = async (category: ICategory) => {
    console.log('delete', category);
  };

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
        {...dataGridProps}
        columns={columns}
        getRowId={(row) => row.category_id}
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
