"use server";

import {
  generateDummyOrderData,
  generateDummyOrdersData,
} from "@util/generator/order";

export const getOrder = async (id, order) => {
  // if (process.env.DEV_ENV !== "production") return generateDummyOrderData();
  try {
    const response = await fetch(
      `${process.env.APP_URL}/orders/${id}/${order}`
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getOrders = async (id) => {
  // if (process.env.DEV_ENV !== "production") return generateDummyOrdersData(Math.round(Math.random()*4)+1);
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const cancelOrder = async (customer_id,id) => {
  try {
    const response = await fetch(`${process.env.APP_URL}/orders/${customer_id}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        	"order_status": "CANCELLED"
      }),
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
