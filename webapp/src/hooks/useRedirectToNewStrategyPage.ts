import { href } from "_/routing/user/hrefs"
import { isStrategy } from "@workspace/models"
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
