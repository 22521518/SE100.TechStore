"use client";
import InputBox from "@components/Input/InputBox";
import OrderItem from "@components/UI/OrderItem";
import {
  faCircleCheck,
  faCreditCard,
  faHouse,
  faMoneyBill,
  faPhone,
  faSearch,
  faSpinner,
  faTruckFast,
  faTruckRampBox,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import { useSearchParams } from "@node_modules/next/navigation";
import { getOrder } from "@service/order";
import { formattedPrice, formattedDate } from "@util/format";
import { toastError, toastWarning } from "@util/toaster";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Tracking() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [order, setOrder] = useState();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const fetchOrder = async (id = "") => {
    
    console.log(id);
    // if (!session) {
    //   toastError("Please log in before tracking you order");
    //   return;
    // }
    if (!id) {
      toastWarning("Please type in your orderId");
      return;
    }
    setIsLoading(true);
    try {
      const data = await getOrder("userId", id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toastError("Could not fetch order details.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (orderId) {
      setOrderIdInput(orderId)
      fetchOrder(orderId);
    }
  }, [orderId]);

  const renderPaymentMethod = (method) => {
    switch (method) {
      case "COD":
        return (
          <div className="flex flex-row gap-2 items-center font-bold">
            COD <FontAwesomeIcon icon={faMoneyBill} />
          </div>
        );
      case "CREDIT_CARD":
        return (
          <div className="flex flex-row gap-2 items-center font-bold">
            Credit Card <FontAwesomeIcon icon={faCreditCard} />
          </div>
        );
      case "ELECTRO_WALLET":
        return (
          <div className="flex flex-row gap-2 items-center font-bold">
            Electro Wallet <FontAwesomeIcon icon={faWallet} />
          </div>
        );
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return <div className="pending">{status}</div>;
      case "SHIPPED":
        return <div className="shipping">{status}</div>;
      case "DELIVERED":
        return <div className="delivered">{status}</div>;
      case "CANCELLED":
        return <div className="cancelled">{status}</div>;
      case "CONFIRMED":
        return <div className="confirmed">{status}</div>;
    }
  };
  return (
    <section className="size-full flex justify-center p-4">
      <div className="flex flex-col gap-10 w-full max-w-[800px]">
        <div className="relative  w-full flex flex-col gap-2">
          <ul className="flex flex-row items-center justify-between ">
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {["PENDING", "CANCELLED"].includes(order?.order_status) && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "CONFIRMED" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "SHIPPED" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
            <li className="grow border-t-4 border-on-background"></li>
            <li className="relative flex items-center justify-center rounded-full size-4 md:size-6 bg-on-background">
              {order?.order_status === "DELIVERED" && (
                <span className="bg-background rounded-full size-2 md:size-3 absolute"></span>
              )}
            </li>
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
                <InputBox value={orderIdInput} onChange={setOrderIdInput} />
              </div>
              <button
                className="button-variant-1 size-12 text-2xl"
                onClick={() => fetchOrder(orderIdInput.trim())}
              >
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faSearch} />
                )}
              </button>
            </div>

            {renderStatus(order?.order_status)}
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <div className="flex flex-row gap-2 items-center justify-between">
            <h3 className="text-lg">Delivery estimate</h3>
            <h3 className="text-lg">{formattedDate(order?.created_at, 3)}</h3>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <div className="flex flex-col gap-2 items-start">
            <h3 className="text-lg font-bold">{order?.customer.full_name}</h3>
            <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
              <FontAwesomeIcon icon={faHouse} />
              <p>
                {order?.shipping_address.address.address +
                  ", " +
                  order?.shipping_address.address.city +
                  ", " +
                  order?.shipping_address.address.state}
              </p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2 items-start">
              <FontAwesomeIcon icon={faPhone} />
              <p>{order?.customer.phone_number}</p>
            </div>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <div className="flex flex-row gap-2 items-center justify-between">
            <h3 className="text-lg">Payment method</h3>
            <h3 className="text-lg">
              {renderPaymentMethod(order?.payment_method)}
            </h3>
          </div>
        </div>

        <div className="panel-1">
          <div className="flex flex-col md:flex-row gap-2 items-start justify-between">
            <div className="flex flex-row gap-2 grow items-center">
              <h3 className="font-bold text-lg">Order id:</h3>
              <h3 className="font-bold ">{order?.order_id}</h3>
            </div>
            <div className="text-xl">
              <span className="font-bold">
                {formattedPrice(order?.total_price)}{" "}
              </span>{" "}
              ({order?.order_items.length} items)
            </div>
          </div>

          <div className=" w-full border-t-2 border-on-secondary my-4"></div>

          <ul className="flex flex-col gap-4">
            {isLoading
              ? Array.from({ length: 2 }).map((_, index) => (
                  <OrderItem key={index} loading={true} />
                ))
              : order?.order_items.map((item) => (
                  <OrderItem
                    key={item.order_id + item.product_id}
                    orderItem={item}
                  />
                ))}
          </ul>
        </div>
        <div></div>
      </div>
    </section>
  );
}
