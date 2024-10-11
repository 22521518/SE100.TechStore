import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

const ProductCard = () => {
  return (
    <div className="flex flex-col w-full gap-2 shadow-lg p-2 rounded-lg bg-surface text-on-surface hover:shadow-on-background/50 hover:shadow-2xl cursor-pointer">
      <div className="text-lg font-semibold break-all ">Product name</div>
      <div className='relative w-full h-[200px] flex justify-center'>
        <Image
          src="https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-15-Pro/Blue-Titanium/Apple-iPhone-15-Pro-Blue-Titanium-thumbnail.png"
          alt="product image"
          width={300}
          height={300}
          quality={75}
          className="h-full object-contain w-full"
          priority
        />
      </div>
      <div className="text-lg">600,000 VNĐ</div>
      <div className="text-sm opacity-50 font-semibold">
        900,000 VNĐ <span className="text-red-500">-30%</span>{" "}
      </div>
      <div className="text-yellow-400 flex flex-row items-baseline gap-1">
        <span className="font-semibold">5</span>
        <FontAwesomeIcon icon={faStar} />
      </div>
    </div>
  );
};

export default ProductCard;
