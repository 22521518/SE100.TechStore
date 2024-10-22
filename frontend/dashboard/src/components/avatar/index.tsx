'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type AvatarImageProps = {
  src: string;
  alt: string;
  size?: number;
};

const AvatarImage = ({ src, alt, size = 64 }: AvatarImageProps) => {
  return (
    <>
      {' '}
      <Box
        className={`rounded-full overflow-hidden`}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={`items-center object-fit flex justify-center w-full`}
        />
      </Box>
    </>
  );
};

export default AvatarImage;
