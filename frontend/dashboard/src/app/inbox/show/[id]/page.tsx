'use client';

import AvatarImage from '@components/avatar';
import InboxBox from '@components/inbox/inbox-box';
import InboxChatBar from '@components/inbox/inbox-chat-bar';
import InboxRoomShow from '@components/inbox/show/inbox-show';
import { IInboxRoom } from '@constant/interface.constant';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Stack, Typography } from '@mui/material';
import { generateRandomInboxRoom } from '@utils/random.util';
import React from 'react';

type InboxShowProps = {
  showRoom: IInboxRoom;
};

const InboxShow = ({ showRoom }: InboxShowProps) => {
  const identity = '--admin';
  const roomMessage = showRoom;

  return <InboxRoomShow showRoom={roomMessage} />;
};

export default InboxShow;
