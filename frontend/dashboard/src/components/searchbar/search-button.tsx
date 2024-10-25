'use client';

import { Button } from '@mui/material';
import React from 'react';

type SearchButtonType = {
  onClick: () => void;
};

const SearchButton = ({ onClick }: SearchButtonType) => {
  return (
    <Button
      variant="outlined"
      className="bg-accent border-solid border-accent text-white font-bold px-4 py-2 inline-block normal-case h-full"
      onClick={onClick}
    >
      Search
    </Button>
  );
};

export default SearchButton;
