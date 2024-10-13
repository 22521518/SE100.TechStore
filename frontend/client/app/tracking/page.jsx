"use client";
import InputBox from "@components/Input/InputBox";
import OrderItem from "@components/UI/OrderItem";
import {
  faCircleCheck,
  faHouse,
  faPhone,
  faSearch,
  faSpinner,
  faTruckFast,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

export default function Tracking() {
  return (
    <section className="size-full flex justify-center p-4">
      <div className="flex flex-col gap-10 w-full max-w-[800px]">
        <div className="relative  w-full flex flex-col gap-2">
          <ul className="flex flex-row items-center justify-between ">
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
            </li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background"></li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background"></li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background"></li>
          </ul>
          <ul className="flex flex-row items-center justify-between text-xl">
            <li>
              <FontAwesomeIcon icon={faSpinner} />
            </li>
            <li>
              <FontAwesomeIcon icon={faTruckRampBox} />
            </li>
            <li>
              <FontAwesomeIcon icon={faTruckFast} />
            </li>
            <li>
              <FontAwesomeIcon icon={faCircleCheck} />
            </li>
          </ul>
        </div>
        <div className="panel-1">
          <div className="flex flex-col md:flex-row gap-2 items-starts justify-between">
            <div className="flex flex-row gap-2 grow items-center">
              <h3 className="font-bold text-lg">Order id:</h3>
              <div>
                <InputBox />
              </div>
              <button className="button-variant-1 size-12 text-2xl">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <div className="pending">Pending</div>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <div className="flex flex-row gap-2 items-center justify-between">
            <h3 className="text-lg">Delivery estimate</h3>
            <h3 className="text-lg">Jan 19, 2024</h3>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <div className="flex flex-col gap-2 items-start">
            <h3 className="text-lg font-bold">John Doe</h3>
            <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
              <FontAwesomeIcon icon={faHouse} />
              <p>123 street, phuong 1, quan 2, TP HCM</p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
              <FontAwesomeIcon icon={faPhone} />
              <p>1234 567 890</p>
            </div>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <div className="flex flex-row gap-2 items-center justify-between">
            <h3 className="text-lg">Payment method</h3>
            <h3 className="text-lg">Credit card</h3>
          </div>
        </div>

        <div className="panel-1">
          <div className="flex flex-col md:flex-row gap-2 items-start justify-between">
            <div className="flex flex-row gap-2 grow items-center">
              <h3 className="font-bold text-lg">Order id:</h3>
              <h3 className="font-bold ">ABC12345</h3>
            </div>
            <div className="text-xl">
              <span className="font-bold">4,999,000 VNĐ </span> (4 items)
            </div>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <ul className="flex flex-col gap-4">
           <OrderItem/>
           <OrderItem/>
           <OrderItem/>
          </ul>
        </div>
        <div></div>
      </div>
    </section>
  );
}
