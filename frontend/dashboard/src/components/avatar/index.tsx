'use client';

import { ClassNames } from '@emotion/react';
import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';

type AvatarImageProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

const AvatarImage = ({ src, alt, size = 64, className }: AvatarImageProps) => {
  return (
    <>
      <Box
        className={`rounded-full overflow-hidden shadow-sm ${className} `}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={`items-center object-contain flex justify-center w-full h-full  `}
        />
      </Box>
    </>
  );
};

export default AvatarImage;
