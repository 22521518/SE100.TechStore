"use client";
import { fetchDistricts, fetchProvinces, fetchWards } from "@actions/address";
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
  faCreditCardAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
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
    router.push("/cart/checkout/payment/receipt");
  };

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      <div className="w-full grid grid-cols-1 md:grid-rows-[auto_1fr] md:grid-flow-col gap-4">
        {/* Cart header */}
        <ul className="flex flex-row items-center gap-2">
          <h3 className="text-xl opacity-50">Cart</h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="text-xl opacity-50">Checkout</h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="font-bold text-2xl">Payment</h3>
        </ul>
        {/* Cart items list */}
        <div className="panel-1 ">
          <h3 className="text-xl  mb-2">
            Select Payment method <FontAwesomeIcon icon={faLocationDot} />
          </h3>
          <Divider />

          <label
            className="flex flex-col py-4 gap-4 rounded-xl bg-surface my-2"
            htmlFor="credit card"
          >
            <div className="flex flex-row justify-between gap-2 h-fit items-center px-4">
              <div className="flex flex-row gap-4 items-center">
                <RadioButton
                  name={"payment method"}
                  value={"credit card"}
                  checked={selectedOption === "credit card"}
                  onChange={handleRadioSelectionChange}
                />
                <h3>Credit card</h3>
              </div>
              <FontAwesomeIcon icon={faCreditCardAlt} />
            </div>
            <Divider />

            <div className="flex flex-col gap-4 px-4 bg-inherit text-sm">
              <PhoneInput value={""} name={"Card number"} onChange={() => {}} />
              <InputBox value={""} name={"Holder's name"} onChange={() => {}} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker name={"Expiration"} monthOnly={true} />
                <PhoneInput value={""} name={"CVV"} onChange={() => {}} />
              </div>
            </div>
          </label>

          <label
            className=" py-4 gap-4 rounded-xl bg-surface my-2 flex flex-row justify-between  h-fit items-center px-4"
            htmlFor="App wallet"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"App wallet"}
                checked={selectedOption === "App wallet"}
                onChange={handleRadioSelectionChange}
              />
              <h3>App wallet</h3>
            </div>
            <FontAwesomeIcon icon={faWallet} />
          </label>
          <label
            className="py-4 gap-4 rounded-xl bg-surface my-2 flex flex-row justify-between h-fit items-center px-4"
            htmlFor="COD"
          >
            <div className="flex flex-row gap-4 items-center">
              <RadioButton
                name={"payment method"}
                value={"COD"}
                checked={selectedOption === "COD"}
                onChange={handleRadioSelectionChange}
              />
              <h3>Cash on Delivery</h3>
            </div>
            <FontAwesomeIcon icon={faMoneyBills} />
          </label>
        </div>

        {/* Total review */}
        <div className="panel-1 flex flex-col gap-4 text-base min-w-[250px] md:row-start-2">
          <h3>Your order</h3>
          <ul className="flex flex-col gap-4">
            <OrderItem />
            <OrderItem />
            <OrderItem />
          </ul>

          <Divider />
          <h3 className="text-base md:text-xl">Shipping address</h3>
          <div className="flex flex-col items-start h-full justify-around text-sm">
                  <h4>
                    {"John Doe"} | {"1234 567 890"}
                  </h4>
                  <h3 className="opacity-50">{"123 Street, phuong 1, quan 2, Ho Chi Minh City"}</h3>
                </div>
          <Divider />

          <h3 className="text-base md:text-xl">Discount</h3>
          <div className="flex flex-row gap-2 items-center justify-between">
            <InputBox name={"Vouchers"} value={""} onChange={() => {}} />
            <button className="button-variant-1">Select</button>
          </div>

          <Divider />

          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Subtotal</h3>
            <span className="">
              {Intl.NumberFormat("en-US").format(receipt.subtotal)} VNĐ
            </span>
          </div>
          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Discount</h3>
            <span>
              {Intl.NumberFormat("en-US").format(receipt.discount)} VNĐ
            </span>
          </div>

          <div className="flex flex-row justify-between items-center gap-4">
            <h3 className="opacity-70">Shipment cost</h3>
            <span>
              {Intl.NumberFormat("en-US").format(receipt.discount)} VNĐ
            </span>
          </div>
          <Divider />

          <div className="flex flex-row justify-between items-center gap-4">
            <h3>Grand total</h3>
            <span className="font-bold text-lg">
              {Intl.NumberFormat("en-US").format(receipt.total)} VNĐ
            </span>
          </div>

          <button className="button-variant-1 w-full" onClick={handleConfirm}>
            Confirm order
          </button>
        </div>
      </div>
    </section>
  );
};

export default Payment;
