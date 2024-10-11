"use client";
import React, { useState, useRef } from "react";

const RadioButton = ({ value, name, onChange,checked }) => {
  const radioButtonRef = useRef(null);

  const handleRadioClick = (e) => {
    e.preventDefault();
    radioButtonRef.current && radioButtonRef.current.click();
  };


  return (
    <div className="w-fit flex flex-row gap-2 text-xl text-on-surface items-center">
      <button
        id={value}
        className="border-[2px] rounded-full border-on-background/50 size-4 md:size-5 p-[2px] md:p-1"
        onClick={handleRadioClick}
      >
        <div
          className={`size-full bg-on-primary rounded-full transition-transform duration-200 ${
            checked ? "scale-100" : "scale-0"
          }`}
        ></div>
      </button>
      <input
        ref={radioButtonRef}
        id={value.toString()}
        name={name}
        type="radio"
        className="hidden"
        onChange={() => onChange(value)}
        checked={checked}
      />
    </div>
  );
};

export default RadioButton;
