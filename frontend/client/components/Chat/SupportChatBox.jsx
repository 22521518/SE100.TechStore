"use client";
import { faPaperPlane, faPhone, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import InputBox from "../Input/InputBox";

const SupportChatBox = () => {
  const [position, setPosition] = useState({ bottom: 20, left: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

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
    const clampedBottom = Math.max(0, Math.min(newBottom, window.innerHeight - 50)); // Keep it above the bottom edge
    const clampedLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 50)); // Keep it within the left edge

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

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[500px] grid grid-rows-[auto_1fr_auto] shadow-xl ">
          <div className="size-full grid grid-cols-[1fr_auto] items-center bg-primary-variant text-on-primary p-2">
            <h1 className="font-semibold text-xl">Support chatbox</h1>
            <button className="p-2 text-xl" onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <ul className="bg-primary flex flex-col gap-4 overflow-y-scroll no-scrollbar p-4">
            <li className="whitespace-normal break-all text-base rounded-xl bg-on-primary text-primary size-fit p-2 max-w-[80%] mr-auto ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
              possimus, corporis delectus porro cupiditate quos. Odit facilis
              cumque dolorem, blanditiis reprehenderit labore beatae, cupiditate
              doloribus dignissimos assumenda earum fuga ipsa?
            </li>
            <li className="whitespace-normal break-all text-base rounded-xl bg-on-primary text-primary size-fit p-2 max-w-[80%] mr-auto ">
              hello
            </li>
            <li className="whitespace-normal break-all text-base rounded-xl bg-on-primary text-primary size-fit p-2 max-w-[80%] ml-auto ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
              possimus, corporis delectus porro cupiditate quos. Odit facilis
              cumque dolorem, blanditiis reprehenderit labore beatae, cupiditate
              doloribus dignissimos assumenda earum fuga ipsa?
            </li>
            <li className="whitespace-normal break-all text-base rounded-xl bg-on-primary text-primary size-fit p-2 max-w-[80%] ml-auto ">
              hello
            </li>
          </ul>
          <div className="bg-primary-variant text-on-primary flex p-2 ">
            <InputBox />
            <button className="p-2 text-xl">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      ) : (
        <button
          id="chatButton"
          className=" shadow-xl fixed size-9 m-4 rounded-full bg-on-primary text-primary sm:scale-110 transition-transform duration-150 hover:scale-150 z-50"
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
          <FontAwesomeIcon icon={faPhone} size="lg" />
        </button>
      )}
    </>
  );
};

export default SupportChatBox;
