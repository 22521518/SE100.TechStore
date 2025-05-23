'use client';

import React from 'react';
import {
  ICategory,
  IProduct,
  IProductAttribute,
  IImage
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
import { dummyProductImage } from '@constant/value.constant';
import { handleImage } from '@utils/image.utils';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const ProductCreate = () => {
  const { list } = useNavigation();

  const { onFinish } = useForm<IProduct, HttpError>();

  const { data, isLoading, isError } = useList<ICategory, HttpError>({
    resource: 'categories'
  });
  const categories = data?.data || [];

  const [images, setImages] = React.useState<IImage[]>([
    {
      name: '',
      url: ''
    }
  ]);

  const [productFormValue, setProductFormValue] =
    React.useState<ProductFormValues>({
      product_id: '',
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
    setProductFormValue((prev) => ({
      ...prev,
      attributes
    }));
  };

  const changeImage = ({ name, url }: { name: string; url: string }) => {
    setImages((prev) => {
      if (prev.length === 8) {
        return prev;
      }
      const hasImage = prev.find((image) => image.url === url);
      if (hasImage) return prev;
      return [...prev.filter((image) => image.url !== url), { name, url }];
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImages = [...images];

    files.forEach(async (file) => {
      if (newImages.length < 8) {
        await handleImage(file, changeImage);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (images.length < 4) {
        console.log('Please upload at least 3 image');
        return;
      }

      await onFinish({
        ...productFormValue,
        images: images.slice(1, images.length)
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="pb-4 px-2 flex flex-col">
      <Box className="flex flex-row justify-between p-4">
        <Typography
          variant="h1"
          className="text-xl uppercase font-bold text-accent"
        >
          Create new Product
        </Typography>
      </Box>
      <Box className="grid grid-cols-3 justify-start">
        <CommonContainer className="grid grid-cols-2 col-span-2 justify-between">
          <Stack className="px-3 gap-4 ">
            <Typography variant="h2" className="text-base font-semibold italic">
              Product Images {`(${images.length - 1}/8)`} <br />
              {images.length - 1 > 2 ? (
                <br />
              ) : (
                'Please upload at least 3 images'
              )}
            </Typography>
            <Box className="grid grid-cols-5 gap-2 h-full w-full">
              {images && images.length > 1 ? (
                <>
                  <Box className="col-span-2 rounded-lg relative bg-white group">
                    <div
                      onClick={() => handleRemoveImage(1)}
                      className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                    >
                      {images[1]?.url && (
                        <CancelOutlinedIcon className="text-red-500 cursor-pointer size-12 z-50" />
                      )}
                    </div>
                    <Image
                      src={(images && images[1]?.url) || dummyProductImage}
                      alt="Product Image"
                      width={160}
                      height={160}
                      className="object-contain overflow-hidden h-full w-full hover:cursor-pointer hover:opacity-50"
                    />
                  </Box>

                  <Box className="grid grid-cols-2 grid-rows-3 gap-1 col-span-3 items-center justify-center">
                    {images.map((_, index) => {
                      if (index === 0 || index === 7) return null;
                      const hasImage = images && images[index + 1]?.url;
                      return (
                        <Box
                          key={index + 1}
                          className={`rounded-lg size-full relative overflow-hidden hover:opacity-80 group hover:cursor-pointer ${
                            hasImage && 'bg-white'
                          }`}
                        >
                          {hasImage ? (
                            <>
                              <div
                                onClick={() => handleRemoveImage(index + 1)}
                                className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                {hasImage && (
                                  <CancelOutlinedIcon className="text-red-500 cursor-pointer size-12" />
                                )}
                              </div>
                              <Image
                                src={
                                  images?.[index + 1]?.url || dummyProductImage
                                }
                                alt="Product Image"
                                width={80}
                                height={80}
                                className="rounded-lg object-contain overflow-hidden h-full w-full"
                              />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center relative bg-gray-200">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{
                                  zIndex: 999,
                                  position: 'absolute',
                                  opacity: 0,
                                  width: '100%',
                                  height: '100%',
                                  cursor: 'pointer'
                                }}
                              />
                              <span className="text-gray-400 text-3xl">+</span>
                            </div>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </>
              ) : (
                <>
                  <div className="relative w-full h-full hover:opacity-50 col-span-2 hover:cursor-pointer">
                    <input
                      title="Upload Image"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{
                        zIndex: 999,
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                    />
                    <div className="flex items-center justify-center rounded-lg bg-gray-200 w-full h-full">
                      <span className="text-gray-400 text-3xl">+</span>
                    </div>
                  </div>
                </>
              )}
            </Box>
          </Stack>
          <form
            className="flex-1 flex flex-col justify-between gap-4"
            onSubmit={onSubmit}
          >
            <Stack className="gap-4">
              <FormControl>
                <TextField
                  id="product-name"
                  type="text"
                  defaultValue={''}
                  value={productFormValue.product_name}
                  variant="outlined"
                  label="Product name"
                  aria-describedby="product-name"
                  placeholder="Product name"
                  onChange={(e) => {
                    setProductFormValue({
                      ...productFormValue,
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
                    value={productFormValue.price}
                    variant="outlined"
                    label="Price"
                    aria-describedby="Price"
                    placeholder="1.000"
                    onChange={(e) => {
                      setProductFormValue({
                        ...productFormValue,
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
                    value={productFormValue.categories[0]?.category_id || ''} // Ensure a default value
                    label="Category"
                    onChange={(e) => {
                      setProductFormValue({
                        ...productFormValue,
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
                    value={productFormValue.discount}
                    variant="outlined"
                    label="Discount"
                    aria-describedby="Discount"
                    placeholder="33"
                    onChange={(e) => {
                      setProductFormValue({
                        ...productFormValue,
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
                    value={productFormValue.stock_quantity}
                    variant="outlined"
                    label="Stock Quantity"
                    aria-describedby="Stock Quantity"
                    placeholder="10"
                    onChange={(e) => {
                      setProductFormValue({
                        ...productFormValue,
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
                    value={productFormValue.description}
                    onChange={(e) => {
                      setProductFormValue({
                        ...productFormValue,
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
        <CommonContainer className="w-full py-4">
          <ProductAttributeFields
            attributes={productFormValue.attributes}
            setAttributes={setAttributes}
          />
        </CommonContainer>
      </Box>
    </div>
  );
};

export default ProductCreate;
