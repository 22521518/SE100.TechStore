'use client';

import React from 'react';
import { ICategory } from '@constant/interface.constant';
import { HttpError, useForm } from '@refinedev/core';
import {
  Box,
  Button,
  FormLabel,
  Input,
  Stack,
  Typography
} from '@mui/material';
import { Cancel, Create } from '@mui/icons-material';
import { CategoryFormValues } from '../category.interface';

type CategoryCreateProps = {
  onCancel: () => void;
};

export default function CategoryCreate({ onCancel }: CategoryCreateProps) {
  const { onFinish } = useForm<ICategory, HttpError, CategoryFormValues>({
    resource: 'categories',
    action: 'create',
    redirect: false
  });
  const [category, setCategory] = React.useState<ICategory>({
    category_name: '',
    description: ''
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('category', category);
      await onFinish(category);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg flex flex-col gap-3 shadow-sm">
      <Typography variant="h3" className="text-3xl font-semibold self-center">
        Create Category
      </Typography>
      <form onSubmit={onSubmit} className="flex flex-col gap-8 mt-4">
        <Stack className="gap-3">
          <FormLabel className="gap-4 grid grid-cols-4">
            <Typography variant="h6" className="text-accent font-semibold">
              Name
            </Typography>
            <Input
              type="text"
              disableUnderline
              value={category.category_name}
              onChange={(e) =>
                setCategory({ ...category, category_name: e.target.value })
              }
              className="border border-accent rounded-lg p-2 col-span-3"
            />
          </FormLabel>
          <FormLabel className="gap-4 grid grid-cols-4">
            <Typography variant="h6" className="text-accent font-semibold">
              Description
            </Typography>
            <Input
              type="text"
              multiline
              disableUnderline
              rows={5}
              value={category.description}
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
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
            Create
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
    </div>
  );
}
