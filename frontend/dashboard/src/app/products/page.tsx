'use client';

import SearchBar from '@components/searchbar';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import React from 'react';
import { useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ICategory, IProduct } from '@constant/interface.constant';
import Image from 'next/image';
import CategoryList from '@app/categories/page';
import { useNavigation } from '@refinedev/core';
import CategoryCreate from '@app/categories/create/page';
import CategoryEdit from '@app/categories/edit/[id]/page';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import { dummyProductImage } from '@constant/value.constant';

const ProductList = () => {
  const { create, edit, show } = useNavigation();

  const filterList = ['Newest', 'Price', 'Name', 'Category'];
  const [filter, setFilter] = React.useState({
    search: filterList[0].toLowerCase()
  });
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
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
        field: 'product_id',
        headerName: 'ID',
        type: 'string',
        flex: 3
      },
      {
        field: 'images[0]',
        headerName: 'Image',
        minWidth: 50,
        align: 'center',
        flex: 2,
        renderCell: ({ row }) => {
          return (
            <Image
              src={`${(row.images && row.images[0]) || dummyProductImage}`}
              alt={row.product_name}
              width={48}
              height={48}
              className="items-center object-contain h-max flex justify-center"
            />
          );
        }
      },
      {
        field: 'product_name',
        headerName: 'Name',
        flex: 4
      },
      {
        field: 'categories',
        headerName: 'Category',
        flex: 4,
        renderCell: ({ row }) => {
          return (
            <span className="text-accent h-full self-center">
              {row.categories[0]?.category_name}
            </span>
          );
        }
      },
      {
        field: 'price',
        headerName: 'Price',
        flex: 4
      },
      {
        field: 'stock_quantity',
        headerName: 'Quantity',
        flex: 3
      },
      {
        field: 'actions',
        headerName: '',
        flex: 4,
        renderCell: ({ row }) => {
          return (
            <Box className="flex flex-row gap-1 items-center justify-center h-full">
              <Button
                className="text-accent"
                onClick={() =>
                  row.product_id && edit('products', row.product_id)
                }
              >
                <EditIcon />
              </Button>
              <Button className="text-accent">
                <DeleteIcon />
              </Button>
            </Box>
          );
        }
      }
    ],
    []
  );

  const [categoryCreateModal, setCategoryCreateModal] = React.useState(false);
  const [categoryEditModal, setCategoryEditModal] = React.useState(false);

  const [category, setCategory] = React.useState<ICategory | null>(null);

  const handleCategoryCreate = (mode: boolean) => {
    setCategoryCreateModal(mode);
    setCategoryEditModal(false);
  };

  const handleCategoryEdit = (mode: boolean) => {
    setCategoryEditModal(mode);
    setCategoryCreateModal(false);
  };

  return (
    <>
      <div className="pb-4 mx-2">
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
                  onChange={handleFilterChange}
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
              getRowId={(row) => row.product_id}
              onCellClick={(cell) => {
                if (cell.field !== 'actions') {
                  show('products', cell.row.product_id);
                }
              }}
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
          <CategoryList
            onCancel={() => handleCategoryCreate(false)}
            onEdit={(category: ICategory) => {
              handleCategoryEdit(true);
              setCategory(category);
            }}
            onCreate={() => handleCategoryCreate(true)}
          />
        </Stack>
        {(categoryCreateModal || categoryEditModal) && (
          <div className="bg-slate-700 bg-opacity-75 absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden">
            <Box className="w-2/5">
              {categoryCreateModal && (
                <CategoryCreate onCancel={() => handleCategoryCreate(false)} />
              )}
              {categoryEditModal && (
                <CategoryEdit
                  onCancel={() => handleCategoryEdit(false)}
                  category={category}
                />
              )}
            </Box>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
