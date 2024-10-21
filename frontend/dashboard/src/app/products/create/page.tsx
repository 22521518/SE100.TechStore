'use client';

import React from 'react';
import {
  ICategory,
  IProduct,
  IProductAttribute
} from '@constant/constant.interface';
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
  const categories = data?.data || [];

  const [productValue, setProductValue] = React.useState<IProduct>({
    product_name: '',
    images: [],
    description: '',
    price: 0,
    discount: 0,
    stock_quantity: 0,
    categories: [],
    attributes: []
  });

  const setAttributes = (attributes: IProductAttribute[]) => {
    setProductValue({
      ...productValue,
      attributes
    });
  };

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
                value={productValue.product_name}
                variant="outlined"
                label="Product name"
                aria-describedby="product-name"
                placeholder="Product name"
                onChange={(e) => {
                  setProductValue({
                    ...productValue,
                    product_name: e.target.value
                  });
                }}
              />
            </FormControl>
            <Box className="grid grid-cols-2 gap-4">
              <FormControl>
                <TextField
                  id="price"
                  type="number"
                  value={productValue.price}
                  variant="outlined"
                  label="Price"
                  aria-describedby="Price"
                  placeholder="1.000"
                  onChange={(e) => {
                    setProductValue({
                      ...productValue,
                      price: Number(e.target.value)
                    });
                  }}
                />
              </FormControl>

              <FormControl>
                <InputLabel id="categories">Category</InputLabel>
                <Select
                  labelId="categories"
                  id="demo-simple-select"
                  value={productValue.categories[0]?.category_id}
                  label="Category"
                  onChange={(e) => {
                    setProductValue({
                      ...productValue,
                      categories: categories.filter(
                        (category) =>
                          category.category_id === Number(e.target.value)
                      )
                    });
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
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
                  value={productValue.discount}
                  variant="outlined"
                  label="Discount"
                  aria-describedby="Discount"
                  placeholder="33"
                  onChange={(e) => {
                    setProductValue({
                      ...productValue,
                      discount: Number(e.target.value)
                    });
                  }}
                />
              </FormControl>

              <FormControl>
                <TextField
                  id="stock-quanity"
                  type="number"
                  value={productValue.stock_quantity}
                  variant="outlined"
                  label="Stock Quantity"
                  aria-describedby="Stock Quantity"
                  placeholder="10"
                  onChange={(e) => {
                    setProductValue({
                      ...productValue,
                      stock_quantity: Number(e.target.value)
                    });
                  }}
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
            attributes={productValue.attributes}
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
