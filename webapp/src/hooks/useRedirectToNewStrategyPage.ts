import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { useEffect } from "react"

export const useRedirectToNewStrategyPage = (
	strategyKey: StrategyKey | undefined
) => {
	useEffect(() => {
		if (!strategyKey) return
		window.location.href = webapp.user.strategy(strategyKey).href
	}, [strategyKey])
}
