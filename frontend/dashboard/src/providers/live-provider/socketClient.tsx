'use client'; // Ensures this file runs only on the client side

import { API_DEV_URL } from '@constant/api.constant';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define a context to provide the socket instance
const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection on the client side
    const socketIo = io(API_DEV_URL);
    setSocket(socketIo);

    socket?.on('connect', () => {
      console.log('Connected to the server');

      // Send a message
      socket.emit('message', {
        sender: 'Client',
        content: 'Hello from client!'
      });
    });

    socket?.emit('message', {
      sender: 'Client',
      content: 'Hello from client!'
    });

    socket?.on('message', (message) => {
      console.log('Received message:', message);
      socket.emit('message', {
        sender: 'Client',
        content: 'Hello from client!'
      });
    });

    // Clean up connection on component unmount
    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use the Socket.IO client
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
