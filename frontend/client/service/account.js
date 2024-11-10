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