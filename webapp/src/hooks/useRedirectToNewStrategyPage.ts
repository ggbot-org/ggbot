import { webapp } from "_/routing/webapp"
import { isStrategy } from "@workspace/models"
import { useEffect } from "react"

export const useRedirectToNewStrategyPage = (strategy: unknown) => {
	useEffect(() => {
		if (isStrategy(strategy))
			window.location.href = webapp.user.strategy({
				strategyId: strategy.id,
				strategyKind: strategy.kind
			}).href
	}, [strategy])
}
