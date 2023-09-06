import { sessionWebStorage } from "_/storages/session.js"
import { useEffect } from "react"

export const useGotFirstPageView = () => {
	const gotFirstPageView = sessionWebStorage.gotFirstPageView.get()

	useEffect(() => {
		if (!gotFirstPageView) sessionWebStorage.gotFirstPageView.set(true)
	}, [gotFirstPageView])

	return { gotFirstPageView }
}
