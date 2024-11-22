import { toast } from "sonner"


export const toastSuccess = (message) => {
    toast.success(message)
}

export const toastWarning = (message) => {
    toast.warning(message)
}

export const toastError= (message) => {
    toast.error(message)
}