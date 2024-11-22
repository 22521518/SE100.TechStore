'use client';

import React from 'react';
import {
  ICategory,
  IProduct,
  IProductAttribute
} from '@constant/interface.constant';
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
import { HttpError, useForm, useList, useNavigation } from '@refinedev/core';
import ProductAttributeFields from '@components/products';
import Image from 'next/image';
import CommonContainer from '@components/common-container';
import { ProductFormValues } from '../product.interface';
import { generateRandomProduct } from '@utils/random.util';
import { dummyProductImage } from '@constant/value.constant';
import { handleImage } from '@utils/image.utils';

const ProductCreate = () => {
  const { list, create } = useNavigation();

  const { onFinish } = useForm<IProduct, HttpError>();

  const { data, isLoading, isError } = useList<ICategory, HttpError>({
    resource: 'categories'
  });
  const categories = data?.data || [];

  // const [productValue, setProductValue] = React.useState<IProduct>({
  //   product_name: '',
  //   images: [],
  //   description: '',
  //   price: 0,
  //   discount: 0,
  //   stock_quantity: 0,
  //   categories: [],
  //   attributes: []
  // });

  const [productValue, setProductValue] = React.useState<IProduct>(
    generateRandomProduct()
  );

  const [productFormValue, setProductFormValue] =
    React.useState<ProductFormValues>({
      ...productValue,
      images: []
    });

  const setAttributes = (attributes: IProductAttribute[]) => {
    setProductValue({
      ...productValue,
      attributes
    });
  };

  const changeImage = ({ name, url }: { name: string; url: string }) => {
    setProductFormValue({
      ...productFormValue,
      images: [{ name, url }]
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleImage(files[0], changeImage);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onFinish(productFormValue);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="pb-4 px-2 flex flex-col">
      <Box className="flex flex-row justify-between p-4">
        <Typography
          variant="h1"
          className="text-4xl uppercase font-bold text-accent"
        >
          Create new Product
        </Typography>
      </Box>
      <CommonContainer className="flex flex-row justify-between">
        <Stack className=" flex-1 gap-4 items-center justify-center">
          <Image
            src={
              (productFormValue.images && productFormValue.images[0]?.url) ||
              dummyProductImage
            }
            alt="Product Image"
            width={500}
            height={500}
            className="rounded-lg max-h-[500px] max-w-[500px] object-contain overflow-hidden h-max w-max"
          />
          <input accept="image/*" type="file" onChange={handleImageChange} />
          <Box className="grid grid-cols-5 gap-2 w-full">
            {[].map((i) => (
              <Box key={i} className="col-span-1">
                <Box className="bg-accent rounded-lg size-24"></Box>
              </Box>
            ))}
          </Box>
        </Stack>
        <form
          className="flex-1 flex flex-col justify-between"
          onSubmit={onSubmit}
        >
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
                  defaultValue={''}
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
                  value={productValue.categories[0]?.category_id || ''} // Ensure a default value
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
                  defaultValue={''}
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
                  defaultValue={''}
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
                  value={productValue.description}
                  onChange={(e) => {
                    setProductValue({
                      ...productValue,
                      description: e.target.value
                    });
                  }}
                />
              </FormControl>
            </Box>
          </Stack>
          <Box className="flex flex-row gap-5 justify-end">
            <Button
              className="bg-accent text-secondary-100 py-4 px-8 text-base font-bold inline-block max-h-max min-w-max"
              type="submit"
            >
              Add Product
            </Button>
            <Button
              className="border-accent border-solid border-2 text-accent py-4 px-8 text-base font-bold inline-block min-w-max max-h-max"
              onClick={() => list('products')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </CommonContainer>
      <Box className="flex flex-row justify-between mt-4 py-4 items-start">
        <CommonContainer className="w-full">
          <ProductAttributeFields
            attributes={productValue.attributes}
            setAttributes={setAttributes}
          />
        </CommonContainer>
      </Box>
    </div>
  );
};

export default ProductCreate;
