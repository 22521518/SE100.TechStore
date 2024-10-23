'use client'
import DatePicker from "@components/Input/DatePicker";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import Divider from "@components/UI/Divider";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "postcss";
import React, { useState } from "react";

const Account = () => {
  const [email,setEmail] = useState('JohnDoe@gmail.com')
  const [gender,setGender] = useState('Male');
  const handleRadioSelectionChange = (value) => {
    setGender(value);
  };
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-col gap-2">
        <div className="text-xl font-semibold">My Profile</div>
        <div className="text-sm opacity-60">Manage your personal information</div>
      </div>
      <Divider/>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col gap-4 items-center p-4">
          <FontAwesomeIcon icon={faUserCircle} className="text-6xl" />
          <button>Change photo</button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
              <span className="grid grid-rows-[auto_1fr] md:grid-cols-[100px_1fr] whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-10 ">
                <span>Last name</span>
                <InputBox/>
              </span>
              <span className="grid grid-rows-[auto_1fr] md:grid-cols-[100px_1fr] whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-10 ">
                <span>First name</span>
                <InputBox />
              </span>
          </div>
          <span className="grid grid-cols-1 md:grid-cols-[100px_1fr] whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-x-10 gap-y-4 ">
            <span>Username</span>
            <InputBox />
            <span>Email</span>
            <InputBox value={email}/>
            <span>Phone</span>
            <PhoneInput/>
            <span>Gender</span>
            <div className="flex flex-row gap-4">
                <label
                className="flex gap-2 items-center"
                  htmlFor='Male'
                >
                    <RadioButton name={'gender'} value={'Male'} checked={gender==='Male'} onChange={handleRadioSelectionChange}/>
                    <span>Male</span>
                </label>
                <label
                 className="flex gap-2 items-center"
                htmlFor='Female'>
                    <RadioButton name={'gender'} value={'Female'} checked={gender==='Female'} onChange={handleRadioSelectionChange}/>
                    <span>Female</span>
                </label>
            </div>
          </span>
          <span className="grid grid-rows-[auto_1fr] md:grid-cols-[100px_1fr] md:grid-rows-1 whitespace-nowrap items-start md:items-center md:justify-items-end md:gap-10 ">
            <span>Birth date</span>
            <DatePicker />
          </span>
          <div><button className="button-variant-1 ml-auto">Edit profile</button></div>
        </div>
      </div>
    </section>
  );
};

export default Account;
