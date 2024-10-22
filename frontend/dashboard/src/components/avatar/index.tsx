'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type AvatarImageProps = {
  src: string;
  alt: string;
};

const AvatarImage = ({ src, alt }: AvatarImageProps) => {
  return (
    <>
      {' '}
      <Box className="max-h-16 max-w-16 rounded-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          className="items-center object-contain flex justify-center"
        />
      </Box>
    </>
  );
};

export default AvatarImage;
