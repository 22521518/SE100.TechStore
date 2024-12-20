'use client';

import { IProductAttribute } from '@constant/interface.constant';
import { Add, Remove } from '@mui/icons-material';
import { Box, Button, Input, Stack, Typography } from '@mui/material';
import React from 'react';

type ProductAttributeFieldsProps = {
  attributes: IProductAttribute[];
  setAttributes: (attributes: IProductAttribute[]) => void;
};

const ProductAttributeFields = ({
  attributes,
  setAttributes
}: ProductAttributeFieldsProps) => {
  const [currentAttribute, setCurrentAttribute] =
    React.useState<IProductAttribute>({
      id: attributes.length,
      name: '',
      detail: ''
    });

  return (
    <Stack className="shadow-sm">
      <Typography
        variant="h4"
        className="uppercase text-center font-bold text-xl border-solid border-accent border-2 text-accent p-2 mb-1"
      >
        Attributes
      </Typography>

      <Stack>
        <Box className="grid grid-cols-7 py-2 px-4 gap-2">
          <Typography
            variant="h6"
            className="text-accent text-base col-span-1 opacity-80"
          >
            No.
          </Typography>
          <Typography
            variant="h6"
            className="text-accent text-base  col-span-2 opacity-80"
          >
            Name
          </Typography>
          <Typography
            variant="h6"
            className="text-accent text-base col-span-3 opacity-80"
          >
            Detail
          </Typography>
        </Box>
        <Box className="grid grid-cols-7 py-4 gap-2 border-y-[1px] border-solid border-accent border-opacity-45 items-center">
          <span className="col-span-1"></span>
          <Input
            className="col-span-2 border-solid p-2 border-accent border-2 rounded-md max-x-full"
            multiline
            placeholder="Attribute"
            disableUnderline
            value={currentAttribute.name}
            onChange={(e) =>
              setCurrentAttribute({ ...currentAttribute, name: e.target.value })
            }
          />
          <Input
            className="col-span-3 border-solid p-2 border-accent border-2 rounded-md max-x-full"
            multiline
            placeholder="Attribute detail"
            disableUnderline
            value={currentAttribute.detail}
            onChange={(e) =>
              setCurrentAttribute({
                ...currentAttribute,
                detail: e.target.value
              })
            }
          />
          <Button
            className=" text-accent hover:bg-secondary-300 inline-block h-full rounded-lg"
            onClick={() => {
              if (currentAttribute.name && currentAttribute.detail) {
                setAttributes([...attributes, currentAttribute]);
                setCurrentAttribute({
                  id: attributes.length,
                  name: '',
                  detail: ''
                });
              }
            }}
          >
            <Add />
          </Button>
        </Box>
        {attributes.map((attribute, index) => (
          <Box
            key={index}
            className={`grid grid-cols-7 py-2 px-4 gap-2 border-b-2 border-solid border-spacing-0 border-accent border-opacity-45`}
          >
            <Typography
              variant="h6"
              className="text-accent col-span-1 text-base max-w-full overflow-wrap break-words"
            >
              {index + 1}
            </Typography>
            <Typography
              variant="h6"
              className="text-accent col-span-2 text-base max-w-full overflow-wrap break-words"
            >
              {attribute.name}
            </Typography>
            <Typography
              variant="h6"
              className="text-accent col-span-3 text-base max-w-full overflow-wrap break-words"
            >
              {attribute.detail}
            </Typography>
            <Button
              className="bg-accent text-secondary-100 inline-block h-full rounded-lg"
              onClick={() => {
                const newAttributes = attributes.filter(
                  (attr, id) => id !== index
                );
                newAttributes.map((attr, index) => {
                  attr.id = index;
                });
                setAttributes(newAttributes);
              }}
            >
              <Remove />
            </Button>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export default ProductAttributeFields;
