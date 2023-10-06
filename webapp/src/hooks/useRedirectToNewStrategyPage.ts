import { href } from "_/routing/user/hrefs"
import { isStrategy } from "@workspace/models"
import { useEffect } from "react"

export const useRedirectToNewStrategyPage = (strategy: unknown) => {
	useEffect(() => {
		if (isStrategy(strategy)) {
			window.location.href = href.strategyPage({
				strategyId: strategy.id,
				strategyKind: strategy.kind
			})
		}
	}, [strategy])
}
