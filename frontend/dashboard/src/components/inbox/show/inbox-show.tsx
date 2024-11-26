'use client';

import AvatarImage from '@components/avatar';
import InboxChatBar from '@components/inbox/inbox-chat-bar';
import { useSocket } from '@components/socket/socketClient';
import { IInboxMessage, IInboxRoom } from '@constant/interface.constant';
import { SOCKET_INBOX_CHANNEL } from '@constant/socket-channel/socket.channel';
import {
  GetMoreMessagePayload,
  InboxMessagePayload,
  MoreMessagePayload
} from '@constant/socket-payload/inbox-message.payload';
import { dummyAvatar } from '@constant/value.constant';
import { Box, Stack, Typography } from '@mui/material';
import { HttpError, useForm } from '@refinedev/core';
import React, { lazy } from 'react';

type InboxRoomShowProps = {
  showRoom: IInboxRoom;
};

const InboxBox = lazy(() => import('@components/inbox/inbox-box'));

const InboxRoomShow = ({ showRoom }: InboxRoomShowProps) => {
  const socket = useSocket();
  const { onFinish } = useForm<IInboxMessage, HttpError>({
    resource: `inbox/${showRoom.customer.customer_id}`,
    action: 'create'
  });

  const [messages, setMessages] = React.useState<IInboxMessage[]>(
    showRoom.messages || []
  );

  const messagesContainerRef = React.useRef<HTMLDivElement | null>(null);

  const [skip, setSkip] = React.useState(0);

  const [loadingMore, setLoadingMore] = React.useState(false);

  const [bottomScoll, setBottomScroll] = React.useState(true);

  const sortedMessages = React.useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    [messages]
  );

  //Send message to server
  const handleSend = async (message: IInboxMessage) => {
    setBottomScroll(true);
    try {
      const response = await onFinish(message);
      if (response?.data) {
        setMessages((prev) => [...prev, response.data]);
        const payload: InboxMessagePayload = {
          room_id: showRoom.customer.customer_id,
          customer: showRoom.customer,
          message: response.data
        };
        socket.emit(SOCKET_INBOX_CHANNEL.ADD_MESSAGE, payload);
      }
    } catch {
      console.log('Failed to send message');
    }
  };

  // Fetch older messages
  const fetchMoreMessages = async () => {
    setBottomScroll(false);
    if (loadingMore || !messagesContainerRef.current) return; // Prevent multiple simultaneous fetches
    setLoadingMore(true);
    try {
      const payload: GetMoreMessagePayload = {
        room_id: showRoom.customer.customer_id,
        skip: skip
      };
      socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, payload);
    } catch (error) {
      console.error('Failed to fetch older messages:', error);
    }
  };

  const handleScroll = () => {
    setBottomScroll(false);

    if (!messagesContainerRef.current) {
      return;
    }

    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0 && !loadingMore) {
      fetchMoreMessages();
    }
  };

  // Listen for older messages
  React.useEffect(() => {
    const container = messagesContainerRef.current;
    socket.on(
      SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES,
      (data: MoreMessagePayload) => {
        if (data?.messages?.length > 0) {
          // Prepend older messages
          setMessages((prev) => [...data.messages, ...prev]);
          setSkip((prev) => prev + (data.messages.length > 0 ? 1 : 0));
          container?.scrollTo(0, 300);
        }

        setLoadingMore(false);
      }
    );

    return () => {
      socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES);
    };
  }, [socket]);

  // Update messages when room changes
  React.useEffect(() => {
    setMessages(() => {
      setSkip(0);
      setBottomScroll(true);
      return showRoom.messages || [];
    });
  }, [showRoom]);

  // Listen for new messages
  React.useEffect(() => {
    const handleMessage = (data: any) => {
      if (data.room_id === showRoom.customer.customer_id) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    socket.on(SOCKET_INBOX_CHANNEL.GET_MESSAGES, handleMessage);

    return () => {
      socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES, handleMessage);
    };
  }, [showRoom, socket]);

  //Scroll to bottom when new message is received
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (messagesEndRef.current && bottomScoll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, bottomScoll]);

  return (
    <Stack className="w-full h-full">
      <Box className="bg-accent w-full h-max flex flex-row gap-4 items-center p-2">
        <AvatarImage
          size={46}
          alt="avatar"
          src={showRoom.customer.image || dummyAvatar}
        />
        <Typography className="text-white font-semibold text-lg text-font">
          {showRoom.customer.full_name}
        </Typography>
        <Typography className="text-white text-base text-opacity-60 text-font ml-auto mr-2">
          {showRoom.customer.customer_id}
        </Typography>
      </Box>
      <Box
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="w-full flex flex-col gap-0.5 overflow-y-scroll scrollbar-thin p-2 overflow-x-hidden h-full my-1"
      >
        {sortedMessages.map((message, index) => (
          <InboxBox
            key={index}
            message={{
              ...message,
              message: message.message
            }}
            isSender={
              message.sender.sender_id !== showRoom.customer.customer_id
            }
            isStart={
              index < sortedMessages.length - 1 &&
              sortedMessages[index + 1].sender.sender_id ===
                message.sender.sender_id
            }
            isEnd={
              index > 0 &&
              sortedMessages[index - 1].sender.sender_id ===
                message.sender.sender_id
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box className="mt-auto w-full bg-transparent p-2 pb-0 h-max flex flex-row justify-center">
        <InboxChatBar onSend={handleSend} />
      </Box>
    </Stack>
  );
};

export default InboxRoomShow;
