'use client';

import { IInboxMessage } from '@constant/interface.constant';
import { Box, Typography } from '@mui/material';
import { transformDate } from '@utils/transform.util';
import React from 'react';

type InboxBoxProps = {
  message: IInboxMessage;
  isSender: boolean;
  isStart: boolean;
  isEnd: boolean;
};

const InboxBox = ({
  isSender,
  message,
  isEnd = true,
  isStart = true
}: InboxBoxProps) => {
  return (
    <Box
      className={`w-full grid grid-cols-5 
    ${isStart ? 'mb-0' : 'mb-2'}
    ${isEnd ? 'mt-0' : 'mt-2'}
    
    `}
    >
      {isSender && <span></span>}
      <Box
        className={`flex flex-row gap-2 col-span-4 w-full items-center
          ${isSender ? 'justify-end ' : 'justify-start '}`}
      >
        <Typography
          className={`w-max max-w-full col-span-4 rounded-3xl py-2.5 px-4 text-sm
          ${
            isSender
              ? 'bg-accent text-white w-max order-1 ml-auto ' +
                (isEnd ? `rounded-tr-md ` : '') +
                (isStart ? `rounded-br-md ` : '')
              : 'text-accent bg-primary-100 -order-1 ' +
                (isEnd ? `rounded-tl-md ` : '') +
                (isStart ? `rounded-bl-md ` : '')
          }
        `}
        >
          {message.message} / {message.sender.sender_id}
        </Typography>
        <Typography
          className={`text-[0.75rem] lg:w-max text-secondary-300 flex-1 lg:min-w-max ${
            isSender ? 'text-end' : 'md:-mr-2'
          }`}
        >
          {transformDate(new Date(message.created_at).toISOString(), true)}
        </Typography>
      </Box>
    </Box>
  );
};

export default InboxBox;
