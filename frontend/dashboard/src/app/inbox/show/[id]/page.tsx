'use client';

import AvatarImage from '@components/avatar';
import InboxBox from '@components/inbox/inbox-box';
import InboxChatBar from '@components/inbox/inbox-chat-bar';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

const InboxShow = () => {
  return (
    <Stack className="w-full h-full">
      <Box className="bg-slate-800 w-full h-max flex flex-row gap-4 items-center p-2">
        <AvatarImage size={46} alt="avatar" src={dummyAvatar} />
        <Typography className="text-white text-lg text-font">
          InboxShow
        </Typography>
      </Box>
      <Box className="w-full flex flex-col gap-2 overflow-y-scroll scrollbar-thin p-2 overflow-x-hidden h-full">
        {[1, 2, 3, 4, 4, 5, 3, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 3, 4, 5].map(
          (_, index) => (
            <InboxBox key={index} isOwner={index % 2 == 0} />
          )
        )}
      </Box>

      <Box className="mt-auto bg-slate-800 py-4 h-max px-2 ps-3">
        <InboxChatBar />
      </Box>
    </Stack>
  );
};

export default InboxShow;
