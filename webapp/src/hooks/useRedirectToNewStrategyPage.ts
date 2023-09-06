import { href } from "_/routing/user/hrefs.js"
import { isStrategy } from "@ggbot2/models"
import { useEffect } from "react"

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
