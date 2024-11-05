"use server";

import { generateDummyOrderData, generateDummyOrdersData } from "@util/generator/order";

export const getOrder = async (id, order) => {  
  if (process.env.DEV_ENV !== "production") return generateDummyOrderData();
  try {
    const response = await fetch(`https://se100-techstore.onrender.com/orders/${id}/${order}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return {}
  } 
  } catch (error) {
    console.log(error)
    return {}
  }
  
};


export const getOrders = async (id) => {  
  if (process.env.DEV_ENV !== "production") return generateDummyOrdersData(Math.round(Math.random()*4)+1);
  try {
    const response = await fetch(`https://se100-techstore.onrender.com/orders/${id}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return []
  } 
  } catch (error) {
    console.log(error)
    return []
  }
  
};
