'use client';

import ProductFeedbackList from '@app/product-feedback/show/[id]/page';
import ProductSatistics from '@app/product-feedback/statistics';
import { IProduct, IProductFeedback } from '@constant/interface.constant';
import { Box, Stack, Typography } from '@mui/material';
import { HttpError, useNavigation, useForm } from '@refinedev/core';
import { generateProductFeedback } from '@utils/random.util';
import Image from 'next/image';
import React from 'react';

const ProductShow = () => {
  const { edit, list } = useNavigation();
  const { query, formLoading } = useForm<IProduct, HttpError>();
  const record = query?.data?.data;

  const [productValue, setProductValue] = React.useState<IProduct>({
    product_name: record?.product_name || 'Product Name',
    images: record?.images || [],
    description: record?.description || '',
    price: record?.price || 100000,
    discount: record?.discount || 1,
    stock_quantity: record?.stock_quantity || 0,
    categories: record?.categories || [],
    attributes: record?.attributes || []
  });

  const priceDiscout =
    productValue.price * (1 - (productValue.discount || 0) / 100);

  React.useEffect(() => {
    setProductValue({
      product_name: record?.product_name || 'Product Name',
      images: record?.images || [],
      description: record?.description || '',
      price: record?.price || 1100000,
      discount: record?.discount || 1,
      stock_quantity: record?.stock_quantity || 0,
      categories: record?.categories || [],
      attributes: record?.attributes || []
    });
  }, [record]);

  return (
    <div className="pb-4 px-2 flex flex-col gap-4">
      <Box className="py-6 bg-white rounded-lg px-4 grid grid-cols-2">
        <Box className="flex flex-row gap-4 items-center">
          <Image
            src={
              (productValue.images && productValue.images[0]) ||
              'https://images.unsplash.com/photo-1612367289874-0fba3b4a07dd?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            alt={productValue.product_name}
            width={256}
            height={256}
            className="max-w-64 max-h-64 object-contain"
          />
          <Box className="flex flex-col h-full gap-4">
            <Typography variant="h4" className="text-4xl font-bold mb-8">
              {productValue.product_name}
            </Typography>
            <Typography variant="body1" className="text-2xl font-bold">
              {' '}
              {priceDiscout.toFixed(0)} VND
            </Typography>
            <Box className="flex flex-row gap-2">
              <Typography
                variant="body2"
                className="font-bold text-slate-400 line-through text-xl"
              >
                {productValue.price} VND
              </Typography>
              {productValue.discount && productValue.discount !== 0 && (
                <Typography
                  variant="body2"
                  className="font-bold text-red-600 text-xl"
                >
                  -{productValue.discount}%
                </Typography>
              )}
            </Box>
            <Typography variant="body2">
              Stock: {productValue.stock_quantity}{' '}
            </Typography>
            <Typography variant="body2" className="text-slate-400 text-xl">
              {productValue.categories[0]?.category_name}
            </Typography>
          </Box>
        </Box>
        {/* Statics */}
        <Box className="flex items-center justify-end px-4 text-yellow-500">
          <ProductSatistics feedbackList={generateProductFeedback(1000)} />
        </Box>
      </Box>

      <ProductFeedbackList feedbacklist={generateProductFeedback(100)} />
    </div>
  );
};

export default ProductShow;
