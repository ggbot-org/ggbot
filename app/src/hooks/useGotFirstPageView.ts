import { useEffect } from "react"

import { sessionWebStorage } from "../storages/session.js"

export const useGotFirstPageView = () => {
	const gotFirstPageView = sessionWebStorage.gotFirstPageView.get()

	useEffect(() => {
		if (!gotFirstPageView) sessionWebStorage.gotFirstPageView.set(true)
	}, [gotFirstPageView])

	return { gotFirstPageView }
}
