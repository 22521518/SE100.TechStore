'use server'

import { generateDummyCustomerAddresses } from "@util/generator/address";

export const fetchProvinces = async () => {
    const response = await fetch('https://vapi.vnappmob.com/api/province/');
    if(response.ok) 
    {
        const data = await response.json()
        return data.results
    }
    return []
}

export const fetchDistricts = async (id) => {
    const response = await fetch(`https://vapi.vnappmob.com/api/province/district/${id}`);
    if(response.ok) 
    {
        const data = await response.json()
        return data.results
    }
    return []
}

export const fetchWards = async (id) => {
    const response = await fetch(`https://vapi.vnappmob.com/api/province/ward/${id}`);
    if(response.ok) 
    {
        const data = await response.json()
        return data.results
    }
    return []
}

export const getCustomerAddresses = async (id) => {
    if(process.env.DEV_ENV!=='production') return generateDummyCustomerAddresses(Math.floor(Math.random()*4)+1)
    try {
        const response = await fetch(`https://se100-techstore.onrender.com/addresses/${id}`,{
            headers:{
                access_token: ''
            }
        })
        if(response.ok) {
            const data = await response.json()
            return data
        } else {
            return []
        }
    } catch (error) {
        console.log(error)
        return []
    }
}

export const postCustomerAddress = async (payload) => {
    if(process.env.DEV_ENV!=='production') return true
    try {
        const response = await fetch(`https://se100-techstore.onrender.com/addresses/${payload.user_id}`,{
            method:"POST",
            headers: {
                access_token: ''
            },
            body: JSON.stringify(payload)
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

export const patchCustomerAddress = async (payload) => {
    if(process.env.DEV_ENV!=='production') return true
    try {
        const response = await fetch(`https://se100-techstore.onrender.com/addresses/${payload.id}`,{
            method:"PATCH",
            headers: {
                access_token: ''
            },
            body: JSON.stringify(payload)
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

export const deleteCustomerAddress = async (payload) => {
    if(process.env.DEV_ENV!=='production') return true
    try {
        const response = await fetch(`https://se100-techstore.onrender.com/addresses/${payload.id}`,{
            method:"DELETE",
            headers: {
                access_token: ''
            },
            body: JSON.stringify(payload)
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