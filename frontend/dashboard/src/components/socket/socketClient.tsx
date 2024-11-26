'use client';

import { API_DEV_URL } from '@constant/api.constant';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGetIdentity } from '@refinedev/core';
import { IStaff } from '@constant/interface.constant';
import Cookies from 'js-cookie';
import { SOCKET_JOIN_CHANNEL } from '@constant/socket-channel/socket.channel';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: identity } = useGetIdentity<IStaff>();
  const socket = io(API_DEV_URL);

  React.useEffect(() => {
    socket.emit(SOCKET_JOIN_CHANNEL.STAFF_JOIN, {
      socket_id: socket.id,
      user_id: identity?.staff_id
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, identity]);

  React.useEffect(() => {
    socket.on('connection', () => {
      console.log('Socket connected ', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }, [socket]);

  React.useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
