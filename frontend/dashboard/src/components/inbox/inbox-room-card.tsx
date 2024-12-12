'use client';

import AvatarImage from '@components/avatar';
import { IInboxRoomCard } from '@constant/interface.constant';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Stack, Typography } from '@mui/material';
import { transformDate } from '@utils/transform.util';
import React from 'react';

type InboxRoomCardProps = {
  room: IInboxRoomCard;
  isChoosen: boolean;
  onClick: () => void;
};
//{ room, isChoosen }: InboxRoomCardProps
const InboxRoomCard = ({
  room,
  isChoosen = false,
  onClick
}: InboxRoomCardProps) => {
  const message = room.latestMessage;
  const isSeen = message.is_seen;

  return (
    <Box
      className={`grid grid-cols-6 h-max w-full hover:cursor-pointer px-2 py-1 items-center rounded-md 
       ${
         isChoosen
           ? 'hover:bg-opacity-80 bg-secondary-200 '
           : 'hover:bg-opacity-20 hover:bg-secondary-200 opacity-85'
       }  
      `}
      onClick={onClick}
    >
      <AvatarImage
        src={room.customer?.image || dummyAvatar}
        size={46}
        alt="avatar"
      />
      <Stack className="col-span-4">
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <span
              className={`text-accent
            ${!isSeen ? 'font-bold' : ' '}
              `}
            >
              {room.customer?.full_name}
            </span>
            <Box className="flex flex-row items-center gap-1 w-full">
              <Typography
                noWrap={true}
                className={`text-slate-200 text-sm overflow-hidden max-w-[50%] ${
                  !isSeen ? 'font-bold' : ' '
                }`}
              >
                {message.message}
              </Typography>
              <span
                className={`text-slate-200 text-sm ${
                  !isSeen ? 'font-bold' : ' '
                }`}
              >
                {' • '}
              </span>
              <Typography
                className={`text-slate-200 text-[0.6rem] h-max min-w-max align-text-bottom flex-1 ${
                  !isSeen ? 'font-bold' : ' '
                }`}
              >
                {transformDate(
                  new Date(message.created_at).toISOString(),
                  true
                )}
              </Typography>
            </Box>
          </div>
        </div>
      </Stack>
      {!isSeen ? (
        <span className="text-3xl text-accent ml-auto mr-4">•</span>
      ) : null}
    </Box>
  );
};

export default InboxRoomCard;
