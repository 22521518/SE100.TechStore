'use client';

import React from 'react';
import { ICategory } from '@constant/interface.constant';
import { useForm, FormAction, HttpError } from '@refinedev/core';
import {
  Box,
  Button,
  FormLabel,
  Input,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Cancel, Create } from '@mui/icons-material';
import { CategoryFormValues } from '@app/categories/category.interface';
import CommonContainer from '@components/common-container';

type CategoryEditProps = {
  category: ICategory | null;
  onCancel: () => void;
};

export default function CategoryEdit({
  onCancel,
  category
}: CategoryEditProps) {
  const { query, formLoading, onFinish } = useForm<
    ICategory,
    HttpError,
    CategoryFormValues
  >({
    resource: 'categories',
    id: category?.category_id,
    action: 'edit',
    redirect: false
  });
  const record = query?.data?.data;
  console.log('record', category);

  const [categoryValue, setCategoryValue] = React.useState<ICategory>({
    category_id: record?.category_id || -1,
    category_name: record?.category_name || '',
    description: record?.description || ''
  });

  React.useEffect(() => {
    if (record) {
      setCategoryValue(record);
    }
  }, [record]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onFinish(categoryValue);
      onCancel();
    } catch (error) {
      console.log('error', error);
    }
  };

  if (formLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CommonContainer isModal className="p-8 rounded-lg flex flex-col gap-3">
      <Typography variant="h3" className="text-3xl font-semibold self-center">
        Edit Category
      </Typography>
      <form onSubmit={onSubmit} className="flex flex-col gap-8 mt-4">
        <Stack className="gap-3">
          <FormLabel className="gap-4 grid grid-cols-4 items-center">
            <Typography variant="h6" className="text-accent font-semibold">
              ID
            </Typography>
            <TextField
              type="text"
              value={categoryValue.category_id}
              disabled
              className="border border-accent rounded-3xl col-span-3"
            />
          </FormLabel>
          <FormLabel className="gap-4 grid grid-cols-4 items-center">
            <Typography variant="h6" className="text-accent font-semibold">
              Name
            </Typography>
            <Input
              type="text"
              value={categoryValue.category_name}
              onChange={(e) =>
                setCategoryValue({
                  ...categoryValue,
                  category_name: e.target.value
                })
              }
              className="border border-accent rounded-lg p-2 col-span-3"
            />
          </FormLabel>
          <FormLabel className="gap-4 grid grid-cols-4 items-center">
            <Typography variant="h6" className="text-accent font-semibold">
              Description
            </Typography>
            <Input
              type="text"
              multiline
              rows={5}
              value={categoryValue.description}
              onChange={(e) =>
                setCategoryValue({
                  ...categoryValue,
                  description: e.target.value
                })
              }
              className="border border-accent rounded-lg p-2 col-span-3"
            />
          </FormLabel>
        </Stack>
        <Box className="flex flex-row justify-around items-center">
          <Button
            className="bg-accent text-white px-4 py-2 font-bold"
            type="submit"
          >
            <Create />
            Save
          </Button>
          <Button
            className="border-accent border-solid border-x-2 border-y-2 px-4 py-2 font-bold text-accent"
            onClick={onCancel}
          >
            <Cancel />
            Cacnel
          </Button>
        </Box>
      </form>
    </CommonContainer>
  );
}
