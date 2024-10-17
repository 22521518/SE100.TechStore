'use client';

import { ICategory } from '@constant/constant.interface';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigation } from '@refinedev/core';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import { DeleteButton, EditButton, useDataGrid } from '@refinedev/mui';
import React from 'react';
import SearchBar from '@components/searchbar';

export default function CategoryList() {
  const { edit, show, create } = useNavigation();

  const handleDelete = async (id: string) => {
    console.log('delete', id);
  };

  const { dataGridProps } = useDataGrid<ICategory>({
    resource: 'categories'
  });

  const columns = React.useMemo<GridColDef<ICategory>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'string',
        flex: 2
      },
      {
        field: 'title',
        headerName: 'Name',
        type: 'string',
        flex: 4
      },
      {
        field: 'actions',
        headerName: '',
        flex: 3,
        renderCell: ({ row }: any) => {
          return (
            <Box className="flex flex-row gap-1 items-center">
              <EditButton resource="categories" recordItemId={row?.id} />
              <DeleteButton resource="categories" recordItemId={row?.id} />
            </Box>
          );
        }
      }
    ],
    []
  );

  const SearchCategorySubmit = async (query: String) => {
    console.log('SearchCategorySubmit', query);
  };

  return (
    <Stack>
      <Box className="flex flex-row justify-between items-center">
        <Box className="flex flex-row items-center gap-2">
          <InventoryIcon className="text-2xl" />
          <Typography variant="h2" className="text-2xl font-bold">
            Categories
          </Typography>
          <SearchBar title="Category" handleSubmit={SearchCategorySubmit} />
        </Box>
        <Button
          className="bg-accent text-secondary-100 font-bold px-4 py-2"
          onClick={() => create('categories')}
        >
          <AddIcon />
          Add Category
        </Button>
      </Box>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        className="text-accent my-2"
        sx={{}}
      />
    </Stack>
  );
}
