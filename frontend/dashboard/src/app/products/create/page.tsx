'use client';

import React from 'react';
import { ICategory, IProductAttribute } from '@constant/constant.interface';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { HttpError, useList } from '@refinedev/core';
import ProductAttributeFields from '@components/products';
import { useRouter } from 'next/navigation';

const ProductCreate = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useList<ICategory, HttpError>({
    resource: 'categories'
  });

  const [attributes, setAttributes] = React.useState<IProductAttribute[]>([]);
  const categories = data?.data || [];
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [discount, setDiscount] = React.useState(0);
  const [stockQuantity, setStockQuantity] = React.useState(0);
  const [category, setCategory] = React.useState('');

  return (
    <div className="pb-4 px-2 flex flex-col">
      <Box className="flex flex-row justify-between p-4">
        <Typography
          variant="h1"
          className="text-6xl uppercase font-bold text-accent"
        >
          Create new Product
        </Typography>
      </Box>
      <Box className="p-8 gap-4 bg-white rounded-lg flex flex-row justify-between">
        <Stack className=" flex-1 gap-4">
          <Box className="bg-accent rounded-lg w-full h-[500px]">
            <p className="text-secondary-100">Image</p>
          </Box>
          <Box className="grid grid-cols-5 gap-2 w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} className="col-span-1">
                <Box className="bg-accent rounded-lg size-24"></Box>
              </Box>
            ))}
          </Box>
        </Stack>
        <form className="flex-1">
          <Stack className="gap-4">
            <FormControl>
              <TextField
                id="product-name"
                type="text"
                value={name}
                variant="outlined"
                label="Product name"
                aria-describedby="product-name"
                placeholder="Product name"
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <Box className="grid grid-cols-2 gap-4">
              <FormControl>
                <TextField
                  id="price"
                  type="number"
                  value={price}
                  variant="outlined"
                  label="Price"
                  aria-describedby="Price"
                  placeholder="1.000"
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </FormControl>

              <FormControl>
                <InputLabel id="categories">Category</InputLabel>
                <Select
                  labelId="categories"
                  id="demo-simple-select"
                  value={category}
                  label="Category"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    console.log(category);
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="grid grid-cols-2 gap-4">
              <FormControl>
                <TextField
                  id="discount"
                  type="number"
                  value={discount}
                  variant="outlined"
                  label="Discount"
                  aria-describedby="Discount"
                  placeholder="33"
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </FormControl>

              <FormControl>
                <TextField
                  id="stock-quanity"
                  type="number"
                  value={stockQuantity}
                  variant="outlined"
                  label="Stock Quantity"
                  aria-describedby="Stock Quantity"
                  placeholder="10"
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                />
              </FormControl>

              <FormControl className="col-span-2">
                <TextField
                  id="description"
                  label="Description"
                  multiline
                  rows={4}
                  placeholder="Describe your product..."
                />
              </FormControl>
            </Box>
            <Box className="py-10"></Box>
          </Stack>
        </form>
      </Box>
      <Box className="flex flex-row justify-between mt-4 py-4 items-start">
        <Box className="p-8 gap-4 bg-white rounded-lg flex flex-row justify-between">
          <ProductAttributeFields
            attributes={attributes}
            setAttributes={setAttributes}
          />
        </Box>
        <Box className="flex flex-row gap-5 justify-end">
          <Button className="bg-accent text-secondary-100 py-4 px-8 text-lg font-bold inline-block max-h-max min-w-max">
            Add Product
          </Button>
          <Button
            className="border-accent border-solid border-2 text-accent py-4 px-8 text-lg font-bold inline-block min-w-max max-h-max"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ProductCreate;
