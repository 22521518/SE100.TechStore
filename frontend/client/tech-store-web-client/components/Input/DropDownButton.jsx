'use client'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';

const DropDownButton = () => {
    const [isDownDown,setIsDropDown] = useState(false)
  return (
<div className="p-0 gap-2 grid grid-cols-[1fr_auto] h-fit rounded-xl text-lg items-center bg-primary border-[2px] border-secondary overflow-hidden">
    <div className="px-2">
    Category
    </div>
    <button className="p-1 bg-secondary text-on-secondary" onClick={()=>setIsDropDown(prev=>!prev)}>
        <FontAwesomeIcon icon={isDownDown?faAngleUp:faAngleDown}/>
    </button>
</div>
  );
};

export default DropDownButton;