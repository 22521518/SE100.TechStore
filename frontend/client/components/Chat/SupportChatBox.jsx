"use client";
import {
  faAngleDown,
  faHeadset,
  faPaperPlane,
  faPhone,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../Input/InputBox";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { getMessageLog, getMessages, sendMessage } from "@service/message";
import SupportButton from "./SupportButton";
import { toastError } from "@util/toaster";
import useSocket from "@components/socket/useSocket";

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

const SupportChatBox = () => {
  const session = useSelector((state) => state.session);

  const socket = useSocket(session?.customer?.customer_id);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadMessage, setUnreadMessage] = useState(0);
  const [messageLog, setMessageLog] = useState([]);

  const [message, setMessage] = useState("");
  const [isMore, setIsMore] = useState(true);
  const [skip, setSkip] = useState(0);

  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const messageLogRef = useRef(null);

  const fetchMessageLog = async () => {
    if (isLoading||!isMore) return;
    setIsLoading(true);
    try {
      const payload = {
        room_id: session.customer.customer_id,
        skip: skip,
      };
      socket.emit(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, payload);
    } catch (error) {
      console.error("Failed to fetch older messages:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    fetchMessageLog();
    socket.on(SOCKET_INBOX_CHANNEL.GET_MESSAGES, (data) => {
      setMessageLog((prev) => [
        {
          ...data,
          is_customer: data.sender.sender_id === session.customer?.customer_id,
        },
        ...prev,
      ]);
    });

    socket.on(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES, (data) => {
      if (data?.messages?.length > 0) {
        setMessageLog((prev) => [
          ...prev,
          ...data.messages.map((msg) => ({
            ...msg,
            is_customer: msg.sender.sender_id === session.customer?.customer_id,
          })),
        ]);
        setIsMore(data.messages.length >= 20);
        setSkip((prev) => prev + (data.messages.length > 0 ? 1 : 0));
      }
      setIsLoading(false);
    });

    return () => {
      socket.off(SOCKET_INBOX_CHANNEL.GET_MESSAGES);
      socket.off(SOCKET_INBOX_CHANNEL.GET_MORE_MESSAGES);
    };
  }, [socket]);

  const handleSend = async () => {
    if (socket && message.trim() && session.customer) {
      const payload = {
        customer_id: session.customer?.customer_id,
        content: {
          sender: {
            sender_id: session.customer?.customer_id,
            sender_name: session.customer?.username,
          },
          message: message,
        },
      };
      await sendMessage(payload).then((data) => {
        if (data) {
          const msgData = {
            room_id: session.customer?.customer_id,
            sender: {
              sender_id: session.customer?.customer_id,
              sender_name: session.customer?.username,
            },
            message: message,
            created_at: new Date().toISOString(),
            is_seen: false,
          };

          socket.emit(SOCKET_INBOX_CHANNEL.ADD_MESSAGE, msgData);
          setMessageLog((prevMessages) => [
            { ...msgData,message_id:data.message_id, is_customer: true },
            ...prevMessages,
          ]);
          setMessage("");
        } else {
          toastError("Failed to send message");
        }
      });
    }
  };

  const handleScroll = () => {
    if (!messageLogRef.current || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = messageLogRef.current;

    // Check if the user has scrolled up
    if (Math.abs(scrollTop) > 200) {
      setIsScrolledUp(true); // User has scrolled up
    } else {
      setIsScrolledUp(false); // User is at the bottom
    }

    // If we are at the top of the container, fetch more messages
    if (Math.abs(scrollTop) + clientHeight >= scrollHeight) {
      fetchMessageLog();
    }
  };

  const handleScrollToBottom = () => {
    if (isOpen && messageLogRef.current) {
      messageLogRef.current.scrollTo({
        top: messageLogRef.current.scrollHeight,
        behavior: "smooth", // Optional: smooth scroll effect
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setMessageLog((ml) => ml.map((item) => ({ ...item, is_seen: true })));
    }
  }, [isOpen]);

  useEffect(() => {
    setUnreadMessage(
      messageLog.reduce((acc, item) => acc + (item.is_seen ? 0 : 1), 0)
    );
  }, [messageLog, isOpen]);

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[500px] grid grid-rows-[auto_1fr_auto] shadow-xl z-50">
          <div className="size-full grid grid-cols-[1fr_auto] items-center bg-primary-variant text-on-primary p-2">
            <div className="flex flex-row items-center justify-start p-2 gap-2">
              <FontAwesomeIcon icon={faHeadset} className="text-2xl" />
              <h2 className="font-bold text-xl ">Support chat</h2>
            </div>
            <button className="p-2 text-xl" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>

          <ul
            ref={messageLogRef}
            onScroll={handleScroll}
            className="bg-primary/70 backdrop-blur-sm flex flex-col-reverse w-full h-[380px]  justify-items-end gap-4 overflow-y-scroll no-scrollbar py-4 px-2"
          >
            {messageLog?.slice(0).map((item) => (
              <li
                key={item.message_id || item._id}
                className={`${
                  item.is_customer ? "my-message" : "other-message"
                }`}
              >
                {item.message}
              </li>
            ))}
            {isLoading && (
              <div className="animate-pulse text-lg text-on-primary font-bold w-full text-center">
                Loading...
              </div>
            )}
          </ul>

          {isScrolledUp && (
            <div className="fixed bottom-[70px] flex items-center justify-center w-[400px]">
              <button
                className=" bg-on-primary text-primary size-9 shadow-lg rounded-full z-50"
                onClick={handleScrollToBottom}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </button>
            </div>
          )}

          <div className="bg-primary-variant text-on-primary flex p-2">
            <InputBox value={message} onChange={setMessage} />
            <button className="p-2 text-xl" onClick={handleSend}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      ) : (
        <SupportButton
          onClick={() => setIsOpen(true)}
          unreadMsg={unreadMessage}
        />
      )}
    </>
  );
};

export default SupportChatBox;
