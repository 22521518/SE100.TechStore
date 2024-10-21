import React from 'react';
import SearchButton from './search-button';
import { Box, IconButton, InputBase, Paper, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export type SearchBarProps = {
  title: string;
  handleSubmit: (query: string) => Promise<void>;
};

const SearchBar = ({ title, handleSubmit }: SearchBarProps) => {
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
    <Box className="flex flex-row gap-4 text-white mb-2 rounded-lg items-center px-8 py-4 bg-transparent">
      <Paper
        component="form"
        sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
        onSubmit={onSubmit}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={`Search ${title}`}
          inputProps={{ 'aria-label': `search ${title}` }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton
          className="p-2"
          type="button"
          aria-label="search"
          onClick={onClick}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <SearchButton onClick={onClick} />
    </Box>
  );
};

export default SearchBar;
