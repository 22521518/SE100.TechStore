"use server";

import { generateDummyOrder } from "@util/generator/order";

export const getOrder = async (id, order) => {  
  if (process.env.DEV_ENV !== "production") return generateDummyOrder();
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
