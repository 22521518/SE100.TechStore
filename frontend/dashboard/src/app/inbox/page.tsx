'use client';

import InboxRoomCard from '@components/inbox/inbox-room-card';
import SearchBar from '@components/searchbar';
import { IInboxRoomCard } from '@constant/interface.constant';
import { Box, Stack, Typography } from '@mui/material';
import { HttpError, useList } from '@refinedev/core';
import React from 'react';
import InboxShow from './show/[id]/page';

const InboxList = () => {
  const { data, isLoading, isError } = useList<IInboxRoomCard, HttpError>({
    successNotification: (data, values, resource) => {
      return {
        message: `${data?.title} Successfully fetched.`,
        description: 'Success with no errors',
        type: 'success'
      };
    },
    errorNotification: (data, values, resource) => {
      return {
        message: `Something went wrong when getting ${data?.id}`,
        description: 'Error',
        type: 'error'
      };
    }
  });
  const records = React.useMemo(() => data?.data || [], [data]);

  const [rooms, setRooms] = React.useState<IInboxRoomCard[]>(records);
  const [selectedRoom, setSelectedRoom] = React.useState<IInboxRoomCard>(
    rooms[0]
  );
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  React.useEffect(() => {
    setRooms(records);
  }, [records]);

  const onClickRoom = (room: IInboxRoomCard) => {
    setSelectedRoom({
      ...room,
      latestMessage: {
        ...room.latestMessage,
        is_seen: true
      }
    });
  };

  return (
    <Box className="p-1 overflow-hidden h-full w-full">
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
              <InboxRoomCard
                room={room}
                key={index}
                isChoosen={room === selectedRoom}
                onClick={() => onClickRoom(room)}
              />
            ))}
          </Stack>
        </Stack>
        <Box className="col-span-3 w-full h-full overflow-scroll scrollbar-none rounded-lg bg-secondary-400">
          {selectedRoom && <InboxShow showRoom={selectedRoom} />}
        </Box>
      </Box>
    </Box>
  );
};

export default InboxList;
