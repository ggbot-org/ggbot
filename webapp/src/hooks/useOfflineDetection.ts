import { useEffect, useState } from "react"

export const useOfflineDetection = () => {
	const [isOffline, setIsOffline] = useState(false)

	useEffect(() => {
		const onOffline = () => {
			setIsOffline(true)
		}
		const onOnline = () => {
			setIsOffline(false)
		}
		addEventListener("offline", onOffline)
		addEventListener("online", onOnline)
		return () => {
			removeEventListener("offline", onOffline)
			removeEventListener("online", onOnline)
		}
	}, [])

	return isOffline
}
