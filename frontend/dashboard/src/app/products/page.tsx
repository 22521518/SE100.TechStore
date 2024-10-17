'use client';

import SearchBar from '@components/searchbar';

import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import React from 'react';
import { useDataGrid, EditButton, DeleteButton } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IProduct } from '@constant/constant.interface';
import Image from 'next/image';
import CategoryList from '@app/categories/page';
import { useNavigation } from '@refinedev/core';

const ProductList = () => {
  const { create } = useNavigation();

  const filterList = ['Newest', 'Price', 'Name', 'Category'];
  const [filter, setFilter] = React.useState({
    search: filterList[0].toLowerCase()
  });
  const handleChange = (event: SelectChangeEvent<string>) => {
    setFilter({
      ...filter,
      search: event.target.value as string
    });
  };

  const SearchProductSubmit = async (query: String) => {
    console.log('SearchProductSubmit', query);
  };

  const { dataGridProps } = useDataGrid<IProduct>();

  const columns = React.useMemo<GridColDef<IProduct>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'string',
        flex: 3
      },
      {
        field: 'image',
        headerName: 'Image',
        minWidth: 50,
        align: 'center',
        flex: 2,
        renderCell: ({ row }) => {
          return (
            <Image
              // src={row.image}
              src="https://images.unsplash.com/photo-1612367289874-0fba3b4a07dd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={row.name}
              width={48}
              height={48}
              className="items-center object-contain h-max flex justify-center"
            />
          );
        }
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 4
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 4
      },
      {
        field: 'price',
        headerName: 'Price',
        flex: 4
      },
      {
        field: 'quantity',
        headerName: 'Quantity',
        flex: 3
      },
      {
        field: 'actions',
        headerName: '',
        flex: 4,
        renderCell: () => {
          return (
            <Box className="flex flex-row gap-1 items-center">
              <EditButton />
              <DeleteButton />
            </Box>
          );
        }
      }
    ],
    []
  );

  return (
    <div className="pb-4 px-2">
      <Stack className="py-6 bg-white rounded-lg px-4">
        <Box className="flex flex-row justify-between items-center">
          <Box className="flex flex-row items-center gap-2">
            <InventoryIcon className="text-2xl" />
            <Typography variant="h2" className="text-2xl font-bold">
              All Products
            </Typography>
            <SearchBar title="Product" handleSubmit={SearchProductSubmit} />
            <FormControl variant="outlined" className="mr-1 min-w-max hidden">
              <InputLabel id="sort-by-label">Sort by:</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by-select"
                value={filter.search}
                onChange={handleChange}
                label="Sort by"
                className="rounded-sm min-w-max"
              >
                {filterList.map((item, index) => (
                  <MenuItem key={index} value={item.toLowerCase()}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            className="bg-accent text-secondary-100 font-bold px-4 py-2"
            onClick={() => create('products')}
          >
            <AddIcon />
            Add Product
          </Button>
        </Box>
        {/* List */}
        <Box className="flex flex-col">
          <DataGrid
            {...dataGridProps}
            columns={columns}
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
        </Box>
      </Stack>

      <Stack className="my-8 py-6 bg-white rounded-lg px-4">
        <CategoryList />
      </Stack>
    </div>
  );
};

export default ProductList;
