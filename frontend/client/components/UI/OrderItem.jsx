import Link from "@node_modules/next/link";
import { formattedPrice } from "@util/format";
import Image from "next/image";
import React from "react";

const OrderItem = ({ orderItem, loading }) => {
  if (loading)
    return (
      <div className="w-full min-h-[90px]  bg-surface text-on-surface rounded-xl grid grid-cols-[auto_1fr_auto] gap-2 p-2">
        <div className="size-full aspect-square bg-primary animate-pulse rounded-lg"></div>

        <div className="flex flex-col justify-between items-start">
          <div className=" h-6 md:h-7 bg-primary animate-pulse w-[100px] rounded-lg">
          </div>
          <div className="h-5 md:h-7 bg-primary animate-pulse w-[50px] rounded-lg"></div>
        </div>

        <div className="flex flex-col justify-between items-end">
          <div className="font-semibold h-5 w-[100px] bg-primary animate-pulse  rounded-lg">
            
          </div>
          <div className="text-red-500 font-semibold  h-3 w-[50px] bg-primary animate-pulse rounded-lg">
          </div>
          <div className="font-semibold h-6 w-[150px] bg-primary animate-pulse rounded-lg">
          </div>
        </div>
      </div>
    );
  return (
    <Link
      href={`/product/${orderItem?.product_id}`}
      className="grid grid-cols-[auto_1fr_auto] gap-2 bg-surface text-on-surface p-2 rounded-xl"
    >
      <div className="size-[75px] scale-[0.8] md:scale-100 transition-transform duration-200 aspect-square flex items-center">
        <Image
          src={
            orderItem?.product.images[0]
              ? orderItem.product.images[0].url
              : process.env.NEXT_PUBLIC_APP_LOGO
          }
          alt="product image"
          width={300}
          height={300}
          className="size-full "
        />
      </div>

      <div className="flex flex-col justify-between items-start">
        <h1 className=" text-base md:text-lg">
          {orderItem?.product.product_name}
        </h1>
        <h2 className="text-base md:text-lg">x{orderItem?.quantity}</h2>
      </div>

      <div className="flex flex-col justify-between items-end">
        <h2 className="font-semibold text-sm opacity-70">
          {formattedPrice(orderItem?.product.price)}
        </h2>
        <h2 className="text-red-500 font-semibold text-xs opacity-70">
          -{orderItem?.product.discount}%
        </h2>
        <h2 className="font-semibold">
          {formattedPrice(orderItem?.unit_price)}
        </h2>
      </div>
    </Link>
  );
};

export default OrderItem;
