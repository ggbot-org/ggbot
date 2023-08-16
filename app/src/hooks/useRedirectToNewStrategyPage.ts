import { isStrategy } from "@ggbot2/models"
import { useEffect } from "react"

import { href } from "../routing/hrefs.js"

export const useRedirectToNewStrategyPage = (strategy: unknown) => {
	useEffect(() => {
		if (isStrategy(strategy)) {
			const { id, kind } = strategy
			window.location.href = href.strategyPage({
				strategyId: id,
				strategyKind: kind
			})
		}
	}, [strategy])
}
