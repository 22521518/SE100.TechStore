"use client";
import { faPaperPlane, faPhone, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import InputBox from "../Input/InputBox";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { getMessageLog } from "@service/message";

const SupportChatBox = () => {
  const session = useSelector((state) => state.session);
  const [position, setPosition] = useState({ bottom: 20, left: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [unreadMessage, setUnreadMessage] = useState(0);
  const [messageLog, setMessageLog] = useState([
    //   {
    //   sender: sender,
    //   message_id: getRandomString(12),
    //   message: getRandomString(50),
    //   created_at: getRandomDate().toISOString(),
    //   is_seen: Math.random() < 0.5, // Randomly setting as seen or not
    // }
  ]);

  const [message, setMessage] = useState("");

  const fetchMessageLog = () => {
    getMessageLog(session.user?.id).then((data) =>
      setMessageLog(data.messages)
    );
  };

  useEffect(() => {
    if (isOpen) {
      setMessageLog((ml) => ml.map((item) => ({ ...item, is_seen: true })));
    }
  }, [isOpen]);

  useEffect(() => {
    setUnreadMessage(
      messageLog.reduce((acc, item) => acc + (item.is_seen ? 0 : 1), 0) > 0
    );
  }, [messageLog]);

  useEffect(() => {
    fetchMessageLog();
  }, []);
  const handleDragStart = (e) => {
    setIsDragging(true);

    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    setOffset({
      x: clientX - position.left,
      y: window.innerHeight - clientY - position.bottom,
    });

    setInitialPosition({ x: clientX, y: clientY });
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      // Calculate new position
      const newBottom = window.innerHeight - clientY - offset.y;
      const newLeft = clientX - offset.x;

      // Ensure the button stays within the viewport
      const clampedBottom = Math.max(
        0,
        Math.min(newBottom, window.innerHeight - 50)
      ); // Keep it above the bottom edge
      const clampedLeft = Math.max(
        0,
        Math.min(newLeft, window.innerWidth - 50)
      ); // Keep it within the left edge

      setPosition({
        bottom: clampedBottom,
        left: clampedLeft,
      });
    }
  };

  const handleDragEnd = (e) => {
    const clientX =
      e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const clientY =
      e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;

    setIsOpen(clientX === initialPosition.x && clientY === initialPosition.y);

    setIsDragging(false);
    setInitialPosition({ x: 0, y: 0 });
  };

  const handleSend = async () => {
    if (message.trim()) {  // Check for non-empty message
      setMessage('');  // Clear the input
      setMessageLog((prevMessageLog) => [
        ...prevMessageLog,
        {
          sender: { sender_id: "123", sender_name: "me" },
          message_id: (Math.random() * 1000).toString(),
          message: message,
          created_at: new Date().toISOString(),
          is_seen: true,
        },
      ]);
    }
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[500px] grid grid-rows-[auto_1fr_auto] shadow-xl z-50">
          <div className="size-full grid grid-cols-[1fr_auto] items-center bg-primary-variant text-on-primary p-2">
            <h1 className="font-semibold text-xl">Support chatbox</h1>
            <button className="p-2 text-xl" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <ul className="bg-primary/70 backdrop-blur-sm flex flex-col-reverse justify-items-end gap-4 overflow-y-scroll no-scrollbar p-4">
            {messageLog?.slice(0).reverse().map((item) => (
              <li
                key={item.message_id}
                className={`${
                  item.sender.sender_id === "123"
                    ? "my-message"
                    : "other-message"
                }`}
              >
                {item.message}
              </li>
            ))}
          </ul>
          <div className="bg-primary-variant text-on-primary flex p-2">
            <InputBox value={message} onChange={setMessage} />
            <button className="p-2 text-xl" onClick={handleSend}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      ) : (
        <button
          id="chatButton"
          className={` shadow-xl fixed size-9 m-4 rounded-full bg-on-primary text-primary sm:scale-110 transition-transform duration-150 hover:scale-150 z-50 ${
            unreadMessage > 0 ? `animate-bounce` : ""
          }`}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{
            bottom: `${position.bottom}px`,
            left: `${position.left}px`,
            position: "fixed",
            cursor: "pointer",
          }}
        >
          {unreadMessage > 0 && (
            <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 size-4 text-xs sm:text-sm rounded-full bg-primary text-on-primary font-semibold flex items-center justify-center">
              {unreadMessage}
            </div>
          )}
          <FontAwesomeIcon icon={faPhone} size="lg" />
        </button>
      )}
    </>
  );
};

export default SupportChatBox;
