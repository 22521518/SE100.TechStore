'use client';

import SearchBar from '@components/searchbar';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import CommonContainer from '@components/common-container';
import { transformVNMoney } from '@utils/transform.util';

const ProductList = () => {
  const { create, edit, show } = useNavigation();

  const [productQuery, setProductQuery] = React.useState('');
  const SearchProductSubmit = async (query: string) => {
    setProductQuery(query);
  };

  const { dataGridProps } = useDataGrid<IProduct>({
    resource: `products?q=${productQuery}&`,
    pagination: {
      pageSize: 10,
      mode: 'client'
    },
    sorters: {
      initial: [
        {
          field: 'product_name',
          order: 'desc'
        }
      ]
    }
  });

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
              src={`${row.images && row.images[0]}`}
              alt={row.product_name}
              width={48}
              height={48}
              className="items-center object-contain h-full flex justify-center"
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
        flex: 4,
        renderCell: ({ row }) => {
          return (
            <Typography className="h-full flex items-center">
              {transformVNMoney(row.price)}
            </Typography>
          );
        }
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
    [edit]
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
    <div className="pb-4 mx-2 flex flex-col gap-4">
      <CommonContainer className="gap-4">
        <Box className="flex flex-row justify-between items-center">
          <Box className="flex flex-row items-center gap-2">
            <SearchBar title="Product" handleSubmit={SearchProductSubmit} />
            <InventoryIcon className="text-2xl" />

            {productQuery ? (
              <>
                <Typography variant="h2" className="text-2xl font-bold">
                  Search Result: {productQuery}
                </Typography>
                <DeleteForeverIcon
                  className="text-2xl hover:cursor-pointer"
                  onClick={() => setProductQuery('')}
                />
              </>
            ) : (
              <Typography variant="h2" className="text-2xl font-bold">
                All Products
              </Typography>
            )}
          </Box>

          <Button
            className="bg-accent text-secondary-100 font-bold px-4 py-2"
            onClick={() => create('products')}
          >
            <AddIcon />
            Add Product
          </Button>
        </Box>
        <Box className="flex flex-col">
          <DataGrid
            {...dataGridProps}
            getRowId={(row) => row.product_id}
            pagination
            onCellClick={(cell) => {
              if (cell.field !== 'actions') {
                show('products', cell.row.product_id);
              }
            }}
            columns={columns}
            sx={{
              '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]':
                {
                  backgroundColor: 'transparent !important',
                  color: 'black'
                }
            }}
            className="text-accent my-4 bg-transparent overflow-hidden xl:min-h-[670px]"
          />
        </Box>
      </CommonContainer>

      <CommonContainer className="">
        <CategoryList
          onEdit={(category: ICategory) => {
            handleCategoryEdit(true);
            setCategory(category);
          }}
          onCreate={() => handleCategoryCreate(true)}
        />
      </CommonContainer>
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
  );
};

export default ProductList;
