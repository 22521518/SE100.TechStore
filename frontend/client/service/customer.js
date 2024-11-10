'use server'

import { generateDummyCustomerData } from "@util/generator/customer"

export const getCustomer = async (id) => {
    if (process.env.DEV_ENV!=='production') return  generateDummyCustomerData()
    try {
        const response = await fetch(`https://se100-techstore.onrender.com/customers/${id}`,{
            headers: {
                access_token:''
            }
        })
        if(response.ok) {
            const data = await response.json()
            return data
        } else {
            return {}
        }
    } catch (error) {
        console.log(error)
        return {}
        
    }
}