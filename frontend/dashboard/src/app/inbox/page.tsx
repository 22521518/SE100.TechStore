'use client';

import CommonContainer from '@components/common-container';
import InboxRoomCard from '@components/inbox/inbox-room-card';
import SearchBar from '@components/searchbar';
import { IInboxRoom } from '@constant/interface.constant';
import { Box, Stack, Typography } from '@mui/material';
import { HttpError, useList } from '@refinedev/core';
import React from 'react';
import InboxShow from './show/[id]/page';

const InboxList = () => {
  const { data, isLoading, isError } = useList<IInboxRoom, HttpError>({
    resource: 'inbox'
  });

  return (
    <Box className="p-1 overflow-hidden">
      <div className="mr-2 bg-white rounded-lg shadow-md grid grid-cols-5 overflow-hidden h-[97dvh]">
        <Stack className="col-span-2 bg-slate-400 w-full h-full gap-1 px-1 overflow-y-scroll scrollbar-none">
          <Box>
            <Typography variant="h6" className="text-white">
              Inbox
            </Typography>
            <SearchBar
              title="Inbox"
              handleSubmit={async (q: string) => {}}
              className="rounded-full mx-4 px-2"
              showSearchButton={false}
            />
          </Box>
          <Stack className="w-full h-full scrollbar-thin overflow-y-scroll">
            {[
              1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4,
              5, 6
            ].map((_, index) => (
              <InboxRoomCard key={index} />
            ))}
          </Stack>
        </Stack>
        <Box className="col-span-3 w-full h-full overflow-scroll scrollbar-none">
          <InboxShow />
        </Box>
      </div>
    </Box>
  );
};

export default InboxList;
