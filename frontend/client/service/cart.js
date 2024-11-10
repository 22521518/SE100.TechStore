"use server";

import { generateDummyCart } from "@util/generator/cart";

export const getCart = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyCart(Math.round(Math.random() * 10) + 1);
  try {
    const response = await fetch(`https://se100-techstore.onrender.com/carts/${id}`);
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

export const deleteCartItem = async (id,product_id) => {
    if (process.env.DEV_ENV !== "production")
        return true
      try {
        const response = await fetch(`https://se100-techstore.onrender.com/carts/${id}/${product_id}`,{
            method: 'DELETE',
            headers: {
                access_token:''
            },
        })
        if(response.ok) {
            return true
        } else {
            return false
        }
      } catch (error) {
        console.log(error)
        return false
      }
}
