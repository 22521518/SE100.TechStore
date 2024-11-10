'use server'

import { categoriesPreset } from "@util/generator/category"


export const getAllCategory = async () => {
    if (process.env.DEV_ENV !== "production") return categoriesPreset
    try {
        const response = await fetch('https://se100-techstore.onrender.com/categories')
        if(response.ok) {
            const data =  await response.json()
            return data
        } else {
            return []
        }
    } catch (error) {
        console.log(error)
        return []
    }
}