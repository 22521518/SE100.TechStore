'use client';

import { IInboxMessage } from '@constant/interface.constant';
import { Box, Button, IconButton, InputBase, Paper } from '@mui/material';
import { HttpError, useGetIdentity, useShow } from '@refinedev/core';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import React from 'react';

const InboxChatBar = () => {
  const { data: indentity } = useGetIdentity();
  // const { query } = useShow<IInboxMessage, HttpError>();

  return (
    <div className="w-[95%] h-4/5 items-center content-center justify-center flex flex-row bg-secondary-300 rounded-full shadow-2xl p-0">
      <Paper
        component="form"
        className="w-full h-full justify-between items-center flex flex-row rounded-full bg-transparent shadow-none overflow-hidden"
      >
        <InputBase
          sx={{
            '& .MuiInputBase-root': {
              padding: 0,
              height: 'max-content'
            }
          }}
          placeholder={`Enter text`}
          className="flex-1 px-4"
        />
        <Button className="h-full aspect-square p-0 rounded-full hover:bg-slate-900 ">
          <SendRoundedIcon className="-rotate-45 text-3xl -mt-1 text-accent w-max" />
        </Button>
      </Paper>
    </div>
  );
};

export default InboxChatBar;
