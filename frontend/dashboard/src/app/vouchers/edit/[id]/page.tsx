'use client';

import CommonContainer from '@components/common-container';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import { IVoucher } from '@constant/interface.constant';
import { HttpError, useForm, useNavigation } from '@refinedev/core';
import React from 'react';

type VoucherEditProps = {
  voucher: IVoucher;
  onCancel: () => void;
};

const VoucherEdit = ({ onCancel, voucher }: VoucherEditProps) => {
  const { list } = useNavigation();
  const { query, formLoading, onFinish } = useForm<IVoucher, HttpError>({
    resource: 'vouchers',
    action: 'edit',
    id: voucher.voucher_code,
    redirect: false
  });
  const record = query?.data?.data;

  const [voucherValue, setVoucherValue] = React.useState<IVoucher>(
    record || voucher
  );

  React.useEffect(() => {
    setVoucherValue(record || voucher);
  }, [record, voucher]);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await onFinish(voucherValue);
        console.log('voucher');
      } catch (error) {
        console.log('error', error);
      }
    },
    []
  );

  return (
    <CommonContainer>
      <Stack className="gap-2">
        <Box className="flex flex-row items-center gap-2 pb-6 pt-2 px-2">
          <LoyaltyOutlinedIcon className="text-2xl" />
          <Typography
            variant="h3"
            className="text-2xl font-semibold self-center"
          >
            Edit Voucher
          </Typography>
        </Box>
      </Stack>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 py-2">
        <Box className="flex flex-row items-center gap-3">
          <Typography variant="body1" className="font-bold">
            Voucher Code:
          </Typography>
          <FormLabel>{voucherValue.voucher_code}</FormLabel>
          <Divider className="h-0.5 mx-4 opacity-40 flex-1 bg-slate-300" />
        </Box>

        <Box className="gap-4 grid grid-cols-5">
          <FormControl className="col-span-3">
            <TextField
              type="text"
              label="Voucher Name"
              value={voucherValue.voucher_name}
              onChange={(e) =>
                setVoucherValue({
                  ...voucherValue,
                  voucher_name: e.target.value
                })
              }
              className="w-full"
            />
          </FormControl>
          <FormControl className="col-span-2">
            <TextField
              type="float"
              label="Discount Amount"
              value={voucherValue.discount_amount}
              onChange={(e) =>
                setVoucherValue({
                  ...voucherValue,
                  discount_amount: parseFloat(e.target.value)
                })
              }
              className="w-full"
            />
          </FormControl>
        </Box>

        <Box className="flex flex-row items-center ">
          <FormLabel>Voucher Experience</FormLabel>
          <Divider className="h-0.5 mx-4 opacity-40 flex-1 bg-slate-300" />
        </Box>
        <Box className="gap-4 grid grid-cols-2">
          <FormControl>
            <TextField
              type="date"
              label="Valid From"
              value={
                new Date(voucherValue.valid_from).toISOString().split('T')[0]
              }
              onChange={(e) =>
                setVoucherValue({
                  ...voucherValue,
                  valid_from: new Date(e.target.value)
                })
              }
              className="w-full"
            />
          </FormControl>
          <FormControl>
            <TextField
              type="date"
              label="Valid To"
              value={
                new Date(voucherValue.valid_to).toISOString().split('T')[0]
              }
              onChange={(e) =>
                setVoucherValue({ ...voucherValue, valid_to: e.target.value })
              }
              className="w-full"
            />
          </FormControl>
        </Box>
        <Box className="flex flex-row items-center pt-5">
          <Divider className="h-0.5 mx-4 opacity-40 flex-1 bg-slate-300" />
        </Box>
        <Box className="gap-4 grid grid-cols-2">
          <Button
            className="rounded-lg font-bold py-3 border-accent border-2 border-solid text-accent"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg font-bold py-3 bg-accent text-white"
            type="submit"
          >
            Confirm
          </Button>
        </Box>
      </form>
    </CommonContainer>
  );
};

export default VoucherEdit;
