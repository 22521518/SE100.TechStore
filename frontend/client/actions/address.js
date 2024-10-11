'use server'

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