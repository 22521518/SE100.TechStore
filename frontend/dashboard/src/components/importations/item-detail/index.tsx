import ProductCard from '@components/order/product-card';
import { IImportation } from '@constant/interface.constant';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { transformVNMoney } from '@utils/transform.util';
import React from 'react';

type ImportationDetailProps = {
  importation: IImportation;
};

const ImportationDetail = ({ importation }: ImportationDetailProps) => {
  return (
    <div className="pb-1">
      <Stack className="py-2 px-2">
        <Box className="flex flex-row justify-between">
          <Typography variant="body1" className="text-lg font-bold">
            Total:
          </Typography>
          <Typography variant="body1" className="text-lg font-bold">
            {transformVNMoney(importation?.total_price)}
          </Typography>
        </Box>
        <Box className="flex flex-row justify-between">
          <Typography variant="body1" className="text-base">
            Importation Date:
          </Typography>
          <Typography
            variant="body1"
            className="text-accent text-opacity-80 text-base"
          >
            {importation?.import_date
              ? new Date(importation.import_date).toLocaleDateString()
              : ''}
          </Typography>
        </Box>
      </Stack>
      <Box className="flex flex-row items-center gap-4 py-2">
        <Typography variant="h3" className="italic text-lg font-bold">
          Supply Information
        </Typography>
        <Divider className="h-1/2 bg-secondary-200 bg-opacity-30 flex-grow" />
      </Box>
      <Stack className="gap-1 px-2">
        <Box className="flex flex-row justify-between">
          <Typography variant="body1" className="text-base">
            ID:
          </Typography>
          <Typography
            variant="body1"
            className="text-accent text-opacity-80 text-base"
          >
            {importation?.supplier_id}
          </Typography>
        </Box>
        <Box className="flex flex-row justify-between">
          <Typography variant="body1" className="text-base">
            Name:
          </Typography>
          <Typography
            variant="body1"
            className="text-accent text-opacity-80 text-base"
          >
            {importation.supplier?.supplier_name}
          </Typography>
        </Box>
        <Box className="flex flex-row justify-between">
          <Typography variant="body1" className="text-base">
            Contact:
          </Typography>
          <Typography
            variant="body1"
            className="text-accent text-opacity-80 text-base"
          >
            {importation.supplier?.contact_number}
          </Typography>
        </Box>
      </Stack>
      <Box className="flex flex-row items-center gap-4 py-2">
        <Typography variant="h3" className="italic text-lg font-bold">
          Items Information
        </Typography>
        <Divider className="h-1/2 bg-secondary-200 bg-opacity-30 flex-grow" />
        <Typography variant="h3" className="italic text-lg font-bold">
          Total: {importation.import_items.length} items
        </Typography>
      </Box>
      <Box className="flex flex-col gap-2 justify-between items-center border-b-2 border-solid border-secondary-300 pb-4 mb-4">
        {importation.import_items?.map((item, index) => (
          <Box key={index} className="w-full">
            <ProductCard orderItem={item} />
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default ImportationDetail;
