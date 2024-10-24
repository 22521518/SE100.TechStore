"use client";
import InputBox from "@components/Input/InputBox";
import Divider from "@components/UI/Divider";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([
    {
      id: "VOUCHER1",
      description: "hello",
      amount: 50,
      valid_from: "1/1/2024",
      valid_to: "12/12/2024",
    },
    {
      id: "HELLOHOLIDAY",
      description: "happy holiday",
      amount: 20,
      valid_from: "4/5/2024",
      valid_to: "30/6/2024",
    },
    {
      id: "MERRYCHRISTMAS  sdasdasdsadsa",
      description: "merry christmasssssssssssddddddddd",
      amount: 100,
      valid_from: "1/12/2024",
      valid_to: "30/12/2024",
    },
  ]);
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Vouchers</div>
        <div className="text-sm opacity-60">View your vouchers </div>
      </div>
      <Divider />
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center bg-primary-variant py-4">
        <h2 className="font-bold text-xl">VOUCHER CODE</h2>
        <div>
          <InputBox />
        </div>
        <button className="button-variant-1">Save voucher</button>
      </div>
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouchers.map((voucher) => (
          <div className="shadow-md flex flex-row border-2 border-on-secondary">
            <div className="flex items-center justify-center aspect-square h-full bg-on-primary text-primary text-4xl">
                <FontAwesomeIcon icon={faShoppingBag}/>
            </div>
            <div className="p-2 flex flex-col overflow-x-scroll no-scrollbar whitespace-nowrap ">
                <h3 className="text-xl font-bold ">{voucher.id}</h3>
                <h4 className="opacity-60 ">{voucher.description}</h4>
                <div className="flex flex-row items-center gap-2 text-xs">
                  <FontAwesomeIcon icon={faClock} />
                  <h5>{voucher.valid_from} to {voucher.valid_to}</h5>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Vouchers;
