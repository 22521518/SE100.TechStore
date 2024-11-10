"use server";
import { generateDummyVouchersData } from "@util/generator/voucher";

export const getVouchers = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateDummyVouchersData(Math.round(Math.random() * 10) + 1);
  try {
    const response = await fetch('')
    if(response.ok) {
        const data = await response.json()
        return data
    } else {
        return []
    }
  } catch (error) {
    console.log(error)
    return[]
  }
};

export const addVoucher = async (id,voucher) => {
    if (process.env.DEV_ENV !== "production")
        return true
      try {
        const response = await fetch('')
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
