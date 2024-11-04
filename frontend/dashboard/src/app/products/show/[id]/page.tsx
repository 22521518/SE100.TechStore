'use client';

import ProductFeedbackList from '@app/product-feedback/show/[id]/page';
import ProductSatistics from '@app/product-feedback/statistics';
import CommonContainer from '@components/common-container';
import { IProductReceive } from '@constant/interface.constant';
import { Box, Typography } from '@mui/material';
import { HttpError, useNavigation, useForm } from '@refinedev/core';
import Image from 'next/image';
import React from 'react';

const ProductShow = () => {
  const { edit, list } = useNavigation();
  const { query, formLoading } = useForm<IProductReceive, HttpError>();
  const record = query?.data?.data;

  const [productValue, setProductValue] = React.useState<IProductReceive>({
    product_name: record?.product_name || 'Product Name',
    images: record?.images || [],
    description: record?.description || '',
    price: record?.price || 100000,
    discount: record?.discount || 1,
    stock_quantity: record?.stock_quantity || 0,
    categories: record?.categories || [],
    attributes: record?.attributes || [],
    product_feedbacks: record?.product_feedbacks || []
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
      attributes: record?.attributes || [],
      product_feedbacks: record?.product_feedbacks || []
    });
  }, [record]);

  return (
    <div className="pb-4 px-2 flex flex-col gap-4">
      <CommonContainer className="py-6 grid grid-cols-2">
        <Box className="flex flex-row gap-4 items-center">
          <Image
            src={productValue.images && productValue.images[0]}
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
              {priceDiscout.toFixed(0)} VND
            </Typography>
            <Box className="flex flex-row gap-2">
              <Typography
                variant="body2"
                className="font-bold text-secondary-100 text-opacity-75 line-through text-xl"
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
              Stock: {productValue.stock_quantity} items
            </Typography>
            <Typography variant="body2" className="text-secondary-100 text-xl">
              Category: {productValue.categories[0]?.category_name}
            </Typography>
          </Box>
        </Box>
        {/* Statics */}
        <Box className="flex items-center justify-end px-4 text-yellow-500">
          {productValue.product_feedbacks && (
            <ProductSatistics feedbackList={productValue.product_feedbacks} />
          )}
        </Box>
      </CommonContainer>

      {productValue.product_feedbacks && (
        <ProductFeedbackList feedbacklist={productValue.product_feedbacks} />
      )}
    </div>
  );
};

export default ProductShow;
