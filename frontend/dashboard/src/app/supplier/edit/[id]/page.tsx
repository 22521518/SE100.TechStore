import CommonContainer from '@components/common-container';
import { ISupplier } from '@constant/interface.constant';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { HttpError, useForm } from '@refinedev/core';
import React from 'react';

type SupplierEditProps = {
  onCancel: () => void;
  onSuccessfulEdit: (supplierResponse: ISupplier) => void;
  supplier: ISupplier;
};

const SupplierEdit = ({
  supplier,
  onCancel,
  onSuccessfulEdit
}: SupplierEditProps) => {
  const { query, onFinish } = useForm<ISupplier, HttpError>({
    resource: 'supplier',
    action: 'edit',
    id: supplier.supplier_id,
    redirect: false
  });
  const record = query?.data?.data;
  const [supplierValue, setSupplierValue] = React.useState<ISupplier>({
    supplier_name: record?.supplier_name || '',
    contact_number: record?.contact_number || '',
    email: record?.email || '',
    description: record?.description || ''
  });

  const validateInfo = () => {
    if (!supplierValue.supplier_name) {
      return 'Supplier name is required';
    }
    if (!supplierValue.contact_number) {
      return 'Contact number is required';
    }
    if (!supplierValue.email) {
      return 'Email is required';
    }
    return '';
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyField = validateInfo();
    if (emptyField) {
      console.log('Empty field', emptyField);
      return;
    }

    try {
      const response = await onFinish(supplierValue);
      console.log('onSubmit response', response);
      if (response) {
        console.log('onSubmit response', response);
        onSuccessfulEdit(response.data as ISupplier);
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
      className="p-8 flex flex-col gap-5  shadow-sm h-max overflow-hidden"
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
        <Box className="col-span-7 grid grid-cols-11 gap-4">
          <FormControl className="col-span-full my-2">
            <TextField
              type="text"
              label="Supplier Name"
              value={supplierValue.supplier_name}
              onChange={(e) =>
                setSupplierValue((prev) => ({
                  ...prev,
                  supplier_name: e.target.value
                }))
              }
              className="w-full"
            />
          </FormControl>
          <FormControl className="my-2 col-span-4">
            <TextField
              type="text"
              label="Contact Number"
              placeholder="+639123456789"
              value={supplierValue.contact_number}
              onChange={(e) => {
                if (
                  e.target.value.length <= 10 &&
                  (e.target.value.match(/^[0-9]+$/) || e.target.value === '')
                ) {
                  setSupplierValue((prev) => ({
                    ...prev,
                    contact_number: e.target.value
                  }));
                }
              }}
              className="w-full"
            />
          </FormControl>
          <FormControl className="my-2 col-span-7">
            <TextField
              type="text"
              label="Email"
              placeholder="email@example.com"
              value={supplierValue.email}
              onChange={(e) =>
                setSupplierValue((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full"
            />
          </FormControl>
          <FormControl className="col-span-full">
            <TextField
              type="text"
              label="Description"
              multiline
              rows={4}
              value={supplierValue.description}
              onChange={(e) =>
                setSupplierValue((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              className="w-full"
            />
          </FormControl>
        </Box>
        <Box className="flex flex-grow gap-4 max-h-12 ms-auto mt-8">
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

export default SupplierEdit;
