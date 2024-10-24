"use client";
import Divider from "@components/UI/Divider";
import OrderItem from "@components/UI/OrderItem";
import React, { useState } from "react";

const Orders = () => {
  const [selectedView, setSelectedView] = useState("All");
  const viewItems = [
    "All",
    "Pending",
    "Shipping",
    "Delivered",
    "Canceled",
    "Refunded",
  ];
  const [orderItems, setOrderItems] = useState([
    { id: "a", status: "Pending" },
    { id: "b", status: "Shipping" },
    { id: "c", status: "Delivered" },
    { id: "d", status: "Canceled" },
    { id: "e", status: "Refunded" },
  ]);

  const renderActions = (status) => {
    switch (status) {
      case "Pending":
        return <button className="button-variant-2">Cancel</button>;
      case "Shipping":
        return <button className="button-variant-2">Track</button>;
      case "Delivered":
        return (
          <>
            <button className="button-variant-2">Reorder</button>
            <button className="button-variant-2">Refund</button>
          </>
        );
      case "Canceled":
        return <button className="button-variant-2">Reorder</button>;
      case "Refunded":
        return <button className="button-variant-2">Reorder</button>;
      default:
        return null;
    }
  };
  const renderStatus = (status) => {
    switch (status) {
      case "Pending":
        return (
          <div className="text-sm px-2 py-1 text-white font-bold rounded-lg bg-gray-500">
            {status}
          </div>
        );
      case "Shipping":
        return (
          <div className="text-sm px-2 py-1 text-white font-bold rounded-lg bg-blue-500">
            {status}
          </div>
        );
      case "Delivered":
        return (
          <div className="text-sm px-2 py-1 text-white font-bold rounded-lg bg-green-500">
            {status}
          </div>
        );
      case "Canceled":
        return (
          <div className="text-sm px-2 py-1 text-white font-bold rounded-lg bg-red-500">
            {status}
          </div>
        );
      case "Refunded":
        return (
          <div className="text-sm px-2 py-1 text-white font-bold rounded-lg bg-black">
            {status}
          </div>
        );
    }
  };
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Orders</div>
        <div className="text-sm opacity-60">View your orders </div>
      </div>
      <Divider />
      <div>
        <div className="flex flex-row w-full overflow-x-scroll no-scrollbar ">
          {viewItems.map((viewItem) => (
            <button
              className={`grow text-center gap-2 min-w-[100px] p-2 hover:border-on-secondary/50 hover:border-b-2 ${
                selectedView === viewItem
                  ? "border-b-2 border-on-secondary font-bold"
                  : ""
              }`}   
              onClick={()=>setSelectedView(viewItem)}
            >
              {viewItem}
            </button>
          ))}
        </div>
        <Divider />
      </div>
      <div className="flex flex-col justify-center  gap-4">
        {orderItems.filter(item=>item.status===selectedView||selectedView==="All").map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-on-surface/20 rounded-lg p-2 gap-2"
          >
            <OrderItem />
            <div className="flex flex-row justify-between items-center">
              {renderStatus(item.status)}
              <div className="flex gap-2 flex-wrap">
                {renderActions(item.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
