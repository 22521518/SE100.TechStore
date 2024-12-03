import { useState, useEffect } from "react";
import { io } from "socket.io-client";


export const SOCKET_JOIN_CHANNEL = {
    STAFF_JOIN: "STAFF_JOIN",
    STAFF_LEAVE: "STAFF_LEAVE",
  
    CUSTOMER_JOIN: "CUSTOMER_JOIN",
    CUSTOMER_LEAVE: "CUSTOMER_LEAVE",
  };
  
  export const SOCKET_INBOX_CHANNEL = {
    JOIN_ROOM: "JOIN_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
  
    GET_MORE_MESSAGES: "GET_MORE_MESSAGES",
    ADD_MESSAGE: "ADD_MESSAGE",
    GET_MESSAGES: "GET_MESSAGES",
    DELETE_MESSAGE: "DELETE_MESSAGE",
  
    GET_CONVERSATIONS: "GET_CONVERSATIONS",
    DELETE_CONVERSATION: "DELETE_CONVERSATION",
  };

const useSocket = (customerId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!customerId) return;

    const socketInstance = io(`https://se100-techstore.onrender.com`);
    setSocket(socketInstance);

    socketInstance.emit(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN, {
      socket_id: socketInstance.id,
      user_id: customerId,
    });


    return () => {
      socketInstance.disconnect();
    };
  }, [customerId]);

  return socket;
};

export default useSocket;
