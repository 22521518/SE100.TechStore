'use client';

import { IInboxMessage } from '@constant/interface.constant';
import { Box, Button, IconButton, InputBase, Paper } from '@mui/material';
import { HttpError, useGetIdentity, useShow } from '@refinedev/core';
import React from 'react';

const InboxChatBar = () => {
  const { data: indentity } = useGetIdentity();
  const { query } = useShow<IInboxMessage, HttpError>();

  return (
    <div className="w-full">
      <Box className="flex flex-row justify-between gap-4 rounded-lg items-center bg-transparent">
        <Paper
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            overflow: 'hidden'
          }}
          className="w-full flex flex-row items-center p-2"
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={`Search ${''}`}
            inputProps={{ 'aria-label': `search ${''}` }}
          />
          <IconButton
            className="p-2 h-full"
            type="button"
            aria-label="search"
          ></IconButton>
        </Paper>
        <Button>Send</Button>
      </Box>
    </div>
  );
};

export default InboxChatBar;
