"use client";
import { fetchDistricts, fetchProvinces, fetchWards } from "@service/address";
import CheckBox from "@components/Input/CheckBox";
import DatePicker from "@components/Input/DatePicker";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import CartItem from "@components/UI/CartItem";
import Divider from "@components/UI/Divider";
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
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const handleContinueShopping = async () => {
    router.push("/");
  };
  const handleConfirm = async () => {
    window.scrollTo({top:0,behavior:"smooth"})
    setIsConfirmed(true);
  };

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      {/* Total review */}
      <div className="panel-1 flex flex-col gap-4 text-base w-full ">
        {isConfirmed && (
          <>
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-6xl  transition-transform duration-200 scale-90 sm:scale-100 md:scale-110 my-4 text-green-500"
            />
            <h3 className="text-lg sm:text-xl md:text-3xl text-center">
              Thanks for your order!
            </h3>
          </>
        )}
        <h3 className="font-bold md:text-xl">Transaction date</h3>
        <h4 className="opacity-70">Monday, October 9th, 2024</h4>
        <Divider />
        <h3 className="font-bold md:text-xl">Shipping address</h3>
        <div className="flex flex-col items-start h-fit justify-around md:text-xl">
          <h4>
            {"John Doe"} | {"1234 567 890"}
          </h4>
          <h3 className="opacity-50">
            {"123 Street, phuong 1, quan 2, Ho Chi Minh City"}
          </h3>
        </div>
        <Divider />
        <h3 className="font-bold md:text-xl">Payment method</h3>
        <h4 className="opacity-70">Credit card</h4>
        <Divider />

        <h3 className="font-bold md:text-xl">Your order</h3>
        <ul className="flex flex-col gap-4">
          <OrderItem />
          <OrderItem />
          <OrderItem />
        </ul>

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h3 className="opacity-70">Subtotal</h3>
          <span className="">
            {Intl.NumberFormat("en-US").format(receipt.subtotal)} VNĐ
          </span>
        </div>
        <Divider />
        <div className="flex flex-row justify-between items-center gap-4">
          <h3 className="opacity-70">Discount</h3>
          <span>{Intl.NumberFormat("en-US").format(receipt.discount)} VNĐ</span>
        </div>
        <div className="flex flex-row justify-between items-center gap-4">
          <h3 className="opacity-70">Shipment cost</h3>
          <span>{Intl.NumberFormat("en-US").format(receipt.discount)} VNĐ</span>
        </div>

        <Divider />

        <div className="flex flex-row justify-between items-center font-bold gap-4">
          <h3>Grand total</h3>
          <span className="font-bold text-lg">
            {Intl.NumberFormat("en-US").format(receipt.total)} VNĐ
          </span>
        </div>

        <button
          className="button-variant-1 w-full"
          onClick={isConfirmed ? handleContinueShopping : handleConfirm}
        >
          {isConfirmed ? "Continue shopping" : "Confirm"}
        </button>
      </div>
    </section>
  );
};

export default Payment;
