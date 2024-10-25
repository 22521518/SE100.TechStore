'use client';

import AvatarImage from '@components/avatar';
import InboxBox from '@components/inbox/inbox-box';
import InboxChatBar from '@components/inbox/inbox-chat-bar';
import { IInboxRoom } from '@constant/interface.constant';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

type InboxRoomShowProps = {
  showRoom: IInboxRoom;
};

const InboxRoomShow = ({ showRoom }: InboxRoomShowProps) => {
  const identity = '--admin';
  const roomMessage = showRoom;

  return (
    <Stack className="w-full h-full">
      <Box className="bg-accent w-full h-max flex flex-row gap-4 items-center p-2">
        <AvatarImage size={46} alt="avatar" src={dummyAvatar} />
        <Typography className="text-white font-semibold text-lg text-font">
          {roomMessage.customer.full_name}
        </Typography>
        <Typography className="text-white text-base text-opacity-60 text-font ml-auto mr-2">
          {roomMessage.customer.customer_id}
        </Typography>
      </Box>
      <Box className="w-full flex flex-col gap-0.5 overflow-y-scroll scrollbar-thin p-2 overflow-x-hidden h-full my-1">
        {roomMessage.messages.map((message, index) => (
          <InboxBox
            key={index}
            message={message}
            isSender={
              message.sender.sender_id !== roomMessage.customer.customer_id
            }
            isStart={
              index < roomMessage.messages.length - 1 &&
              roomMessage.messages[index + 1].sender.sender_id ===
                message.sender.sender_id
            }
            isEnd={
              index > 0 &&
              roomMessage.messages[index - 1].sender.sender_id ===
                message.sender.sender_id
            }
          />
        ))}
      </Box>

      <Box className="mt-auto w-full bg-transparent p-2 pb-0 h-max flex flex-row justify-center">
        <InboxChatBar />
      </Box>
    </Stack>
  );
};

export default InboxRoomShow;
