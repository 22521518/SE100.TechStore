'use client';

import React from 'react';
import SearchButton from './search-button';
import { Box, IconButton, InputBase, Paper, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export type SearchBarProps = {
  title: string;
  handleSubmit: (query: string) => Promise<void>;
  className?: string;
  showSearchButton?: boolean;
};

const SearchBar = ({
  title,
  handleSubmit,
  className = '',
  showSearchButton = true
}: SearchBarProps) => {
  const [query, setQuery] = React.useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmit(query);
    setQuery('');
  };

  const onClick = () => {
    if (query) {
      handleSubmit(query);
    }
  };

  return (
    <Box className="flex flex-row gap-4 rounded-lg items-center bg-transparent">
      <Paper
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          overflow: 'hidden'
        }}
        onSubmit={onSubmit}
        className={className}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={`Search ${title}`}
          inputProps={{ 'aria-label': `search ${title}` }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full flex-1"
        />
        <IconButton
          className="p-2 h-full"
          type="button"
          aria-label="search"
          onClick={onClick}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      {showSearchButton && <SearchButton onClick={onClick} />}
    </Box>
  );
};

export default SearchBar;
