"use client";
import { fetchDistricts, fetchProvinces, fetchWards } from "@service/address";
import CheckBox from "@components/Input/CheckBox";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import CartItem from "@components/UI/CartItem";
import Divider from "@components/UI/Divider";
import OrderItem from "@components/UI/OrderItem";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import {
  faLocation,
  faLocationDot,
  faMap,
  faTrash,
  faMoneyBill,
  faCashRegister,
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

const Checkout = () => {
  const router = useRouter();

  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [wards, setWards] = useState();

  const [userAddresses, setUserAddresses] = useState([
    {
      fullname: "John Doe",
      phone: "1234 567 890",
      address: "123 Street, Phuong 1, Quan 2, Ho Chi Minh",
      type: "Office",
    },
    {
      fullname: "John Doe",
      phone: "1234 567 890",
      address: "123 Street, Phuong 1, Quan 2, Ho Chi Minh",
      type: "Home",
    },
  ]);

  const [selectedOption, setSelectedOption] = useState(0);

  const [receipt, dispatch] = useReducer(reducer, {
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();

  const handleRadioSelectionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    setDistrict(null);
    getDistricts(province?.id || "");
  }, [province]);

  useEffect(() => {
    setWard(null);
    getWards(district?.id || "");
  }, [district]);

  const getProvinces = async () => {
    const provinces = await fetchProvinces();

    setProvinces(
      provinces.map((item) => {
        return { id: item.province_id, name: item.province_name };
      })
    );
  };

  const getDistricts = async (id) => {
    const districts = await fetchDistricts(id);

    setDistricts(
      districts.map((item) => {
        return { id: item.district_id, name: item.district_name };
      })
    );
  };

  const getWards = async (id) => {
    const wards = await fetchWards(id);

    setWards(
      wards.map((item) => {
        return { id: item.ward_id, name: item.ward_name };
      })
    );
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    const total = receipt.subtotal - receipt.discount;
    dispatch({ type: "change_total", payload: total < 0 ? 0 : total });
  }, [receipt.subtotal, receipt.discount]);

  const handlePayment = async () => {
    router.push("/cart/checkout/payment");
  };

  return (
    <section className="size-full flex flex-col items-center gap-10 p-4">
      <div className="w-full grid grid-cols-1 md:grid-rows-[auto_1fr] md:grid-flow-col gap-4">
        {/* Cart header */}
        <ul className="flex flex-row items-center gap-2">
          <h3 className="text-xl opacity-50">Cart</h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="font-bold text-2xl">Checkout</h3>
          <span className="size-2 sm:size-3 bg-on-background rounded-full opacity-50"></span>
          <h3 className="text-xl opacity-50">Payment</h3>
        </ul>
        {/* Cart items list */}
        <div className="panel-1 ">
          <h3 className="text-xl mb-2">
            Select Shipping address <FontAwesomeIcon icon={faLocationDot} />
          </h3>
          <Divider />
          <div className="flex flex-col py-4 gap-4">
            <div className="flex flex-row gap-1 size-fit items-center">
              <RadioButton
                name={"shipping address"}
                value={0}
                checked={selectedOption === 0}
                onChange={handleRadioSelectionChange}
              />
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <InputBox value={""} name={"Full name *"} onChange={() => {}} />
            <PhoneInput
              value={""}
              name={"Phone number *"}
              onChange={() => {}}
            />
            <div className="flex gap-4 flex-wrap  items-center h-fit rounded-xl w-full z-50">
              <DropDownButton
                value={province}
                options={provinces}
                name="province"
                onChange={setProvince}
                zIndex={70}
              />
              <DropDownButton
                value={district}
                options={districts}
                name="district"
                onChange={setDistrict}
                zIndex={60}
              />
              <DropDownButton
                value={ward}
                options={wards}
                name="ward"
                onChange={setWard}
                zIndex={50}
              />
            </div>
            <InputBox
              value={""}
              name={"Specific address *"}
              onChange={() => {}}
            />
          </div>

          <h3 className="text-xl">Or choose a preset address</h3>
          <Divider />
          <ul className="flex flex-col gap-2 py-4">
            {userAddresses.map((item, index) => (
              <label
                key={index}
                className="grid grid-cols-[auto_1fr] gap-3 items-center w-full bg-surface rounded-lg p-2 min-h-[70px]"
                htmlFor={index + 1}
              >
                <div className="flex flex-row gap-1 size-fit items-center">
                  <RadioButton
                    name={"shipping address"}
                    value={index + 1}
                    checked={selectedOption === index + 1}
                    onChange={handleRadioSelectionChange}
                  />
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <div className="flex flex-col items-start h-full justify-around text-xs">
                  <h4>
                    {item.fullname} | {item.phone}
                  </h4>
                  <h3 className="opacity-50">{item.address}</h3>
                </div>
              </label>
            ))}
          </ul>
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

          <button className="button-variant-1 w-full" onClick={handlePayment}>
            Continue to payment
          </button>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
