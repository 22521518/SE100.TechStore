'use server'

export const patchAccount = async (payload) => {
    if(process.env.DEV_ENV !=='production') return true
    try {
        const response = await fetch(``,{
            method:'PATCH',
            headers:{
                access_token:''
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

export const login = async(payload)=> {
    try {
        const response = await fetch(`${process.env.APP_URL}/auth/login/store`,{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
        if(response.ok) {
            const data  = await response.json()
            return data;
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}