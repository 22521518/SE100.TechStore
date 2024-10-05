"use client";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";

const DatePicker = ({ name, value, onChange }) => {
  const labelRef = useRef(null); // Create a reference for the label
  const datePickerRef = useRef(null);

  const handleFocus = () => {
    labelRef.current.classList.add("scale-90", "-translate-y-2");
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    onChange(value);
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      labelRef.current.classList.remove("scale-90", "-translate-y-2");
    }
  };

  return (
    <div
      className="relative bg-inherit rounded-lg border-[1px] border-on-background/50   outline-none  w-full"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span
        ref={labelRef}
        className="absolute font-semibold bg-inherit left-3 translate-y-1/2 text-base px-2 text-on-background/50 pointer-events-none transition-transform duration-200 transform "
      >
        {name}
      </span>
      <div className="relative flex flex-row grow p-2 py-3 text-xl">
          <input
            ref={datePickerRef}
            type="date"
            readOnly={false}
            tabIndex={-1}
            onKeyDown={(e) => e.preventDefault()}
            className="bg-transparent text-accent w-full pointer-events-none outline-none opacity-0 absolute top-0 left-0"
            onChange={handleDateChange}
          />
          <div className="text-accent grow px-2">
            {value ? value : ""}
          </div>
          <button
            className=""
            onClick={(e) => {
              e.preventDefault();
              datePickerRef.current && datePickerRef.current.showPicker();
            }}
          >
            <FontAwesomeIcon icon={faCalendar} />
          </button>
        </div>
    </div>
  );
};

export default DatePicker;
