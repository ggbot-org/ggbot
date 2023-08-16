import { useContext } from "react"

import { ToastContext } from "../contexts/Toast.js"

export const useToast = () => useContext(ToastContext)
