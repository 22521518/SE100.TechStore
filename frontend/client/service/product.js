"use server";

import { generateDummyProductData, generateDummyProductDetailData } from "@util/generator/product";


export const getAllProduct = async () => {
  console.log(process.env.DEV_ENV)
  if(process.env.DEV_ENV!=="production") return generateDummyProductData(36)
  try {
    const response = await fetch(
      "https://se100-techstore.onrender.com/products"
    );

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      return []
    }
  } catch (e) {
    console.log(e);
    return []
  }
};


export const getProducts = async (size) => {
  
  if(process.env.DEV_ENV!=="production") return generateDummyProductData(size)
  try {
    const response = await fetch(
      `https://se100-techstore.onrender.com/products?pageSize=${size}`
    );

    if (response.ok) {
      const data = await response.json();
      return  data
    } else {
      return []
    }
  } catch (e) {
    console.log(e);
    return []
  }
};

export const getProductDetail = async (id) => {
  if(process.env.DEV_ENV!=="production") return generateDummyProductDetailData();

  try {
    const response = await fetch(
      `https://se100-techstore.onrender.com/products/${id}`
    );

    if (response.ok) {
      const data = await response.json();
      return data
    } else {
      return {}
    }
  } catch (e) {
    console.log(e);
    return {}
  }
};
