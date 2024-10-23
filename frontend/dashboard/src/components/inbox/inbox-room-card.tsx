'use client';

import AvatarImage from '@components/avatar';
import { IInboxRoom } from '@constant/interface.constant';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Stack } from '@mui/material';
import React from 'react';

type InboxRoomCardProps = {
  room: IInboxRoom;
};

const InboxRoomCard = () => {
  return (
    <Box className="grid grid-cols-6 h-max w-full hover:bg-opacity-60 hover:bg-slate-700 px-2 py-1 items-center rounded-md">
      <AvatarImage src={dummyAvatar} size={46} alt="avatar" />
      <Stack className="col-span-4">
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <span className="text-accent">Customer Name</span>
            <Box className="flex flex-row items-center gap-1">
              <span className="text-slate-200 text-sm">Last Message</span>{' '}
              <span className="text-slate-200 text-sm">•</span>
              <span className="text-slate-200 text-sm">Time</span>
            </Box>
          </div>
        </div>
      </Stack>
      <span className="text-slate-200 text-sm">Unread</span>
    </Box>
  );
};

export default InboxRoomCard;
