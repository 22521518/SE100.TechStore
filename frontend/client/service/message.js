'use server'

import { generateMockInboxRoom } from "@util/generator/message";

export const getMessageLog = async (id) => {
  if (process.env.DEV_ENV !== "production")
    return generateMockInboxRoom()
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