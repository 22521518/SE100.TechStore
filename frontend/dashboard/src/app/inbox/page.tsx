'use client';

import InboxRoomCard from '@components/inbox/inbox-room-card';
import SearchBar from '@components/searchbar';
import { IInboxRoom } from '@constant/interface.constant';
import { Box, Stack, Typography } from '@mui/material';
import { HttpError, useList } from '@refinedev/core';
import React from 'react';
import InboxShow from './show/[id]/page';
import { generateRandomInboxRoom } from '@utils/random.util';

const InboxList = () => {
  const { data, isLoading, isError } = useList<IInboxRoom, HttpError>({
    resource: 'inbox'
  });

  const rooms = generateRandomInboxRoom(25);

  return (
    <Box className="p-1 overflow-hidden">
      <Box className="mr-2 bg-transparent rounded-lg shadow-sm grid grid-cols-5 overflow-hidden h-full gap-2">
        <Stack className="col-span-2 bg-primary-200 w-full h-full gap-1 px-1 overflow-y-scroll scrollbar-none py-2 rounded-lg">
          <Box>
            <Typography variant="h6" className="text-white px-6 font-bold">
              Inbox
            </Typography>
            <SearchBar
              title="Inbox"
              handleSubmit={async (q: string) => {}}
              className="rounded-full mx-4 px-2"
              showSearchButton={false}
            />
          </Box>
          <Stack className="w-full h-full scrollbar-thin overflow-y-scroll gap-0.5">
            {rooms.map((room, index) => (
              <InboxRoomCard key={index} isChoosen={index % 4 == 0} />
            ))}
          </Stack>
        </Stack>
        <Box className="col-span-3 w-full h-full overflow-scroll scrollbar-none rounded-lg bg-secondary-400">
          <InboxShow />
        </Box>
      </Box>
    </Box>
  );
};

export default InboxList;
