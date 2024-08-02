import { useReadStrategyFlow } from "_/hooks/public/api"
import { StrategyKey } from "@workspace/models"
import { useEffect } from "react"

export function useStrategyFlow(strategyKey: StrategyKey | undefined) {
	const { data: strategyFlow, canRun, request } = useReadStrategyFlow()

	useEffect(() => {
		if (!strategyKey) return
		if (canRun) request(strategyKey)
	}, [canRun, request, strategyKey])

	if (!strategyKey) return {
		strategyFlow: undefined
	}

	return {
		strategyFlow
	}
}
