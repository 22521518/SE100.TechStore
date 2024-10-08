"use client";
import { fetchDistricts, fetchProvinces, fetchWards } from "@actions/address";
import CheckBox from "@components/Input/CheckBox";
import DatePicker from "@components/Input/DatePicker";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import CartItem from "@components/UI/CartItem";
import OrderItem from "@components/UI/OrderItem";
import {
  faCheckSquare,
  faCircleCheck,
  faCreditCardAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
    faCheckCircle,
  faCreditCard,
  faLocation,
  faLocationDot,
  faMap,
  faMoneyBills,
  faTrash,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useReducer, useState, useEffect } from "react";

function reducer(state, action) {
  if (action.type === "change_subtotal" && action.payload >= 0) {
    return { ...state, subtotal: action.payload };
  } else if (action.type === "change_discount" && action.payload >= 0) {
    return { ...state, discount: action.payload };
  } else if (action.type === "change_total" && action.payload >= 0) {
    return { ...state, total: action.payload };
  }
  return state;
}

const Payment = () => {
  const paymentMethods = ["credit card", "App wallet", "COD"];
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("credit card");

  const [receipt, dispatch] = useReducer(reducer, {
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  const handleRadioSelectionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    const total = receipt.subtotal - receipt.discount;
    dispatch({ type: "change_total", payload: total < 0 ? 0 : total });
  }, [receipt.subtotal, receipt.discount]);

  const handleConfirm = async () => {
    router.push("/");
  };

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      {/* Total review */}
      <div className="panel-1 flex flex-col gap-4 text-base w-full ">
        <FontAwesomeIcon icon={faCircleCheck} className="text-6xl  transition-transform duration-200 scale-90 sm:scale-100 md:scale-110 my-4 text-green-500"/>
        <h1 className='text-lg sm:text-xl md:text-3xl text-center'>Thanks for your order!</h1>
        <h1 className="font-bold md:text-xl">Transaction date</h1>
        <h2 className='opacity-70'>Monday, October 9th, 2024</h2>
        <div className=" w-full border-t-2 border-on-secondary"></div>
        <h1 className="font-bold md:text-xl">Payment method</h1>
        <h2 className='opacity-70'>Credit card</h2>
        <div className=" w-full border-t-2 border-on-secondary"></div>

        <h1 className="font-bold md:text-xl">Your order</h1>
        <ul className="flex flex-col gap-4">
          <OrderItem />
          <OrderItem />
          <OrderItem />
        </ul>

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h1 className="opacity-70">Subtotal</h1>
          <span className="">
            {Intl.NumberFormat("en-US").format(receipt.subtotal)} VNĐ
          </span>
        </div>
        <div className=" w-full border-t-2 border-on-secondary"></div>
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="opacity-70">Discount</h1>
          <span>{Intl.NumberFormat("en-US").format(receipt.discount)} VNĐ</span>
        </div>
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="opacity-70">Shipment cost</h1>
          <span>{Intl.NumberFormat("en-US").format(receipt.discount)} VNĐ</span>
        </div>

        <div className=" w-full border-t-2 border-on-secondary"></div>

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h1>Grand total</h1>
          <span className="font-bold text-lg">
            {Intl.NumberFormat("en-US").format(receipt.total)} VNĐ
          </span>
        </div>

        <button className="button-variant-1 w-full" onClick={handleConfirm}>
          Continue shopping
        </button>
      </div>
    </section>
  );
};

export default Payment;
