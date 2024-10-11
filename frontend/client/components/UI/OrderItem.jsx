
import Image from "next/image";
import React from "react";

const OrderItem = () => {
  return (
    <li className="grid grid-cols-[auto_1fr_auto] gap-2 bg-surface text-on-surface p-2 rounded-xl">
      <div className="w-[50px]  md:scale-[1.5] transition-transform duration-200 aspect-square">
        <Image
          src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-15-Pro/Blue-Titanium/Apple-iPhone-15-Pro-Blue-Titanium-thumbnail.png"
          alt="product image"
          width={300}
          height={300}
          className="size-full object-contain"
        />
      </div>

      <div className="flex flex-col justify-between items-start">
        <h1 className=" text-base md:text-lg">Iphone 16 pro-max</h1>
        <h2 className="font-semibold">42,999,000 VNĐ</h2>
      </div>

      <h2 className="text-base md:text-lg">x3</h2>
    </li>
  );
};

export default OrderItem;
