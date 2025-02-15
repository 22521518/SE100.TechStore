'use client';

import CommonContainer from '@components/common-container';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import React from 'react';
import { IVoucher, IVoucherWithoutCode } from '@constant/interface.constant';
import { HttpError, useForm, useNavigation } from '@refinedev/core';

type VoucherCreateProps = {
  onCancel: () => void;
  onSuccessfulCreate: (voucher: IVoucher) => void;
};

const VoucherCreate = ({
  onCancel,
  onSuccessfulCreate
}: VoucherCreateProps) => {
  const { onFinish } = useForm<IVoucherWithoutCode, HttpError>({
    resource: 'vouchers',
    action: 'create',
    redirect: false
  });

  const onCancelHandler = React.useCallback(() => {
    if (onCancel) onCancel();
  }, [onCancel]);

  const [voucher, setVoucher] = React.useState<IVoucherWithoutCode>({
    voucher_name: '',
    description: '',
    discount_amount: 0,
    valid_from: new Date(),
    valid_to: new Date()
  });

  const validTo = voucher.valid_to;
  const validFrom = voucher.valid_from;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const rep = await onFinish(voucher);
      if (rep) {
        onSuccessfulCreate({
          ...(rep.data as IVoucher)
        });
      }
      onCancelHandler();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <CommonContainer isModal>
      <Stack className="gap-2">
        <Box className="flex flex-row items-center gap-2 pb-6 pt-2 px-2">
          <LoyaltyOutlinedIcon className="text-2xl" />
          <Typography
            variant="h3"
            className="text-2xl font-semibold self-center"
          >
            Create Voucher
          </Typography>
        </Box>
      </Stack>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 py-2">
        <Box className="flex flex-row items-center ">
          <FormLabel>Voucher Information</FormLabel>
          <Divider className="h-0.5 mx-4 opacity-40 flex-1 bg-slate-300" />
        </Box>
        <Box className="gap-4 grid grid-cols-5">
          <FormControl className="col-span-3">
            <TextField
              type="text"
              label="Voucher Name"
              value={voucher.voucher_name}
              onChange={(e) =>
                setVoucher({ ...voucher, voucher_name: e.target.value })
              }
              className="w-full"
            />
          </FormControl>
          <FormControl className="col-span-2">
            <TextField
              type="number"
              label="Discount Amount"
              value={voucher.discount_amount}
              onChange={(e) =>
                setVoucher({
                  ...voucher,
                  discount_amount: Number(e.target.value)
                })
              }
              className="w-full"
            />
          </FormControl>
          <FormControl className="col-span-full">
            <FormLabel className="mx-2">Description</FormLabel>
            <TextField
              type="text"
              value={voucher.description}
              multiline
              rows={3}
              onChange={(e) =>
                setVoucher((prev) => {
                  return { ...prev, description: e.target.value };
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
              value={new Date(validFrom).toISOString().split('T')[0]}
              onChange={(e) =>
                setVoucher({ ...voucher, valid_from: new Date(e.target.value) })
              }
              className="w-full"
            />
          </FormControl>
          <FormControl>
            <TextField
              type="date"
              label="Valid To"
              value={new Date(validTo).toISOString().split('T')[0]}
              onChange={(e) =>
                setVoucher({ ...voucher, valid_to: new Date(e.target.value) })
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
            onClick={onCancelHandler}
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

export default VoucherCreate;
