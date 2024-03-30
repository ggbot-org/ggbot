import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { useEffect } from "react"

export const useRedirectToNewStrategyPage = (
	strategyKey: StrategyKey | undefined
) => {
	useEffect(() => {
		if (!strategyKey) return
		GOTO(webapp.user.strategy(strategyKey))
	}, [strategyKey])
}
