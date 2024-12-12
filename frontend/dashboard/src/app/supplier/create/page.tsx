'use client';

import CommonContainer from '@components/common-container';
import { ISupplier } from '@constant/interface.constant';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { HttpError, useForm } from '@refinedev/core';
import React from 'react';

type SupplierCreateProps = {
  onCancel: () => void;
};

const SupplierCreate = ({ onCancel }: SupplierCreateProps) => {
  const { onFinish } = useForm<ISupplier, HttpError>({
    resource: 'supplier'
  });

  const [supplier, setSupplier] = React.useState<ISupplier>({
    supplier_name: '',
    contact_number: '',
    email: '',
    description: ''
  });

  const validateInfo = () => {
    if (!supplier.supplier_name) {
      return 'Supplier name is required';
    }
    if (!supplier.contact_number) {
      return 'Contact number is required';
    }
    if (!supplier.email) {
      return 'Email is required';
    }
    return '';
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('onSubmit');

    const emptyField = validateInfo();
    if (emptyField) {
      console.log('Empty field', emptyField);
      return;
    }

    try {
      const response = await onFinish(supplier);
      if (response) {
        console.log('onSubmit response', response);
        onCancel();
      } else {
        console.log('onSubmit error', response);
      }
    } catch (error) {
      console.log('onSubmit error', error);
    }
  };

  return (
    <CommonContainer
      isModal
      className="p-8 flex flex-col gap-5 shadow-sm h-[100%] max-h-[100%] overflow-hidden"
      heightMax={false}
      heightMin={false}
    >
      <Typography variant="h3" className="text-3xl font-semibold self-center">
        Supplier
      </Typography>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-between mt-4 min-h-[90%] overflow-hidden w-full"
      >
        <div className="col-span-7 grid grid-cols-2 gap-4">
          <div className="col-span-2 my-2">
            <label
              htmlFor="supplier_name"
              className="block text-sm font-medium text-gray-700"
            >
              Supplier Name
            </label>
            <input
              type="text"
              name="supplier_name"
              id="supplier_name"
              value={supplier.supplier_name}
              onChange={(e) =>
                setSupplier({ ...supplier, supplier_name: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-none sm:text-sm py-4 px-2"
            />
          </div>
          <div className="my-2">
            <label
              htmlFor="contact_number"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              type="text"
              name="contact_number"
              id="contact_number"
              placeholder="+639123456789"
              value={supplier.contact_number}
              onChange={(e) =>
                setSupplier({ ...supplier, contact_number: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm  py-4 px-2"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email@example.com"
              value={supplier.email}
              onChange={(e) =>
                setSupplier({ ...supplier, email: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm  py-4 px-2"
            />
          </div>
          <div className="col-span-2 my-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              aria-multiline
              rows={8}
              placeholder="Description of the supplier (optional)"
              name="description"
              id="description"
              value={supplier.description}
              onChange={(e) =>
                setSupplier({ ...supplier, description: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm py-4 px-2"
            />
          </div>
        </div>
        <Box className="flex flex-grow gap-4 max-h-12 ms-auto">
          <Button
            className="bg-accent text-secondary-100 font-bold py-4 px-16 "
            type="submit"
          >
            Save
          </Button>
          <Button
            className="border-accent border-solid border-2 text-accent py-4 px-8 text-base font-bold min-w-max max-h-max"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </CommonContainer>
  );
};

export default SupplierCreate;
