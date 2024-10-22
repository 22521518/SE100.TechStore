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
      className="bg-transparent border-solid border-accent text-accent font-bold px-4 py-2 inline-block normal-case h-full"
      onClick={onClick}
    >
      Search
    </Button>
  );
};

export default SearchButton;
