"use client";
import InputBox from "@components/Input/InputBox";
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
        <div className="w-full h-fit overflow-hidden rounded-xl border-[2px] border-on-secondary p-4 bg-secondary/20 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col md:flex-row gap-2 items-starts justify-between">
            <div className="flex flex-row gap-2 grow items-center">
              <h1 className="font-bold text-lg">Order id:</h1>
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
            <h1 className="text-lg">Delivery estimate</h1>
            <h1 className="text-lg">Jan 19, 2024</h1>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <div className="flex flex-col gap-2 items-start">
            <h1 className="text-lg font-bold">John Doe</h1>
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
            <h1 className="text-lg">Payment method</h1>
            <h1 className="text-lg">Credit card</h1>
          </div>
        </div>

        <div className="w-full h-fit overflow-hidden rounded-xl border-[2px] border-on-secondary p-4 bg-secondary/20 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col md:flex-row gap-2 items-start justify-between">
            <div className="flex flex-row gap-2 grow items-center">
              <h1 className="font-bold text-lg">Order id:</h1>
              <h1 className="font-bold ">ABC12345</h1>
            </div>
            <div className="text-xl">
              <span className="font-bold">4,999,000 VNĐ </span> (4 items)
            </div>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <ul className="flex flex-col gap-4">
            <li className="grid grid-cols-[auto_1fr_auto] gap-2 bg-surface text-on-surface p-2 rounded-xl">
              <div className="w-[100px]  md:scale-[1.2] transition-transform duration-200 aspect-square">
                <Image
                  src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-15-Pro/Blue-Titanium/Apple-iPhone-15-Pro-Blue-Titanium-thumbnail.png"
                  alt='product image'
                  width={300}
                  height={300}
                  className="size-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-around items-start">
                <h1 className="font-bold text-base md:text-xl">
                  Iphone 16 pro-max
                </h1>
                <h2 className="font-semibold">42,999,000 VNĐ</h2>
              </div>

              <h2 className="text-xl">x3</h2>
            </li>

            <li className="grid grid-cols-[auto_1fr_auto] gap-2 bg-surface text-on-surface p-2 rounded-xl">
              <div className="w-[100px]  md:scale-[1.2] transition-transform duration-200 aspect-square">
                <Image
                  src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-15-Pro/Blue-Titanium/Apple-iPhone-15-Pro-Blue-Titanium-thumbnail.png"
                  alt='product image'
                  width={300}
                  height={300}
                  className="size-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-around items-start">
                <h1 className="font-bold text-base md:text-xl">
                  Iphone 16 pro-max
                </h1>
                <h2 className="font-semibold">42,999,000 VNĐ</h2>
              </div>

              <h2 className="text-xl">x3</h2>
            </li>
            <li className="grid grid-cols-[auto_1fr_auto] gap-2 bg-surface text-on-surface p-2 rounded-xl">
              <div className="w-[100px]  md:scale-[1.2] transition-transform duration-200 aspect-square">
                <Image
                  src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-15-Pro/Blue-Titanium/Apple-iPhone-15-Pro-Blue-Titanium-thumbnail.png"
                  alt='product image'
                  width={300}
                  height={300}
                  className="size-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-around items-start">
                <h1 className="font-bold text-base md:text-xl">
                  Iphone 16 pro-max
                </h1>
                <h2 className="font-semibold">42,999,000 VNĐ</h2>
              </div>

              <h2 className="text-xl">x3</h2>
            </li>
          </ul>
        </div>
        <div></div>
      </div>
    </section>
  );
}
