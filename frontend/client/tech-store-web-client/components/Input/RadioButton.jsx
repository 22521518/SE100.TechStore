"use client";
import React, { useState } from "react";

const RadioButton = ({ options, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onIndexChange = (e, index) => {
    e.preventDefault();
    setSelectedIndex(index)
    onChange(options[index]);
  };
  return (
    <ul className="p-4 flex flex-row gap-4">
      {options.map((option, index) => (
        <li
          key={index}
          className="flex flex-row gap-2 text-xl text-on-surface items-center"
        >
          <button
            id={option}
            className="border-[3px] rounded-full border-on-background/50 size-6 p-1"
            onClick={(e) => onIndexChange(e,index)}
          >
            {selectedIndex === index && (
              <div className="size-full bg-on-primary rounded-full"></div>
            )}
          </button>
          <label htmlFor={option}>{option}</label>
        </li>
      ))}
    </ul>
  );
};

export default RadioButton;
