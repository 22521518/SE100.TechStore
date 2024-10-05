"use client";
import React, { useRef } from "react";

const InputBox = ({ value='alo', name, onChange }) => {
  const labelRef = useRef(null); // Create a reference for the label

  const handleFocus = () => {
    labelRef.current.classList.add("scale-90","-translate-y-2");
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      labelRef.current.classList.remove("scale-90","-translate-y-2");
    }
  };

  const onTextChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative bg-inherit w-full">
      <span
        ref={labelRef}
        className={`absolute font-semibold bg-inherit left-3 ${value?"-translate-y-2 scale-90":'translate-y-1/2'} text-base px-2 text-on-background/50 pointer-events-none transition-transform duration-200 transform `}
      >
        {name}
      </span>
      <input
        type="text"
        placeholder=""
        value={value}
        className="bg-transparent rounded-lg border-[1px] border-on-background/50  text-xl outline-none p-2 py-3 w-full"
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        onChange={onTextChange}
      />
    </div>
  );
};

export default InputBox;
