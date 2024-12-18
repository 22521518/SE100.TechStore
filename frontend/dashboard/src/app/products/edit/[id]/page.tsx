'use client';

import React from 'react';
import {
  ICategory,
  IProductAttribute,
  IProductReceive
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
import { dummyProductImage } from '@constant/value.constant';
import CommonContainer from '@components/common-container';
import { ProductFormValues } from '@app/products/product.interface';
import { handleImage } from '@utils/image.utils';

const ProductEdit = () => {
  const { list } = useNavigation();

  const { query, onFinish, formLoading } = useForm<
    IProductReceive,
    HttpError
  >();

  const record = query?.data?.data;

  const { data, isLoading } = useList<ICategory, HttpError>({
    resource: 'categories'
  });
  const categories = data?.data || [];

  const [productValue, setProductValue] = React.useState<IProductReceive>({
    product_name: record?.product_name || '',
    images: record?.images || [],
    description: record?.description || '',
    price: record?.price || 0,
    discount: record?.discount || 0,
    stock_quantity: record?.stock_quantity || 0,
    categories: record?.categories || [],
    attributes: record?.attributes || []
  });

  const setAttributes = (attributes: IProductAttribute[]) => {
    setProductValue({
      ...productValue,
      attributes
    });
  };

  const [productFormValue, setProductFormValue] =
    React.useState<ProductFormValues>({
      ...productValue,
      images: [
        {
          name: productValue.product_name,
          url: productValue.images[0]
        }
      ]
    });

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
      console.log('productFormValue', productFormValue);
      await onFinish(productFormValue);
      // list('/products');
    } catch (error) {
      console.log('error', error);
    }
  };

  React.useEffect(() => {
    if (record) {
      setProductValue({
        product_name: record?.product_name || '',
        images: record?.images || [],
        description: record?.description || '',
        price: record?.price || 0,
        discount: record?.discount || 0,
        stock_quantity: record?.stock_quantity || 0,
        categories: record?.categories || [],
        attributes: record?.attributes || []
      });

      setProductFormValue({
        product_name: record?.product_name || '',
        images: [
          {
            name: record?.product_name,
            url: record?.images[0]
          }
        ],
        description: record?.description || '',
        price: record?.price || 0,
        discount: record?.discount || 0,
        stock_quantity: record?.stock_quantity || 0,
        categories: record?.categories || [],
        attributes: record?.attributes || []
      });
    }
  }, [record]);

  if (formLoading || isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="pb-4 px-2 flex flex-col">
      <Box className="flex flex-row justify-between p-4">
        <Typography
          variant="h1"
          className="text-6xl uppercase font-bold text-accent"
        >
          Edit Product
        </Typography>
      </Box>
      <CommonContainer className="p-8 flex flex-row justify-between">
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
              Save
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

export default ProductEdit;
