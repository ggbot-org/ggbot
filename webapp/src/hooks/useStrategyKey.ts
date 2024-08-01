import { strategyKeyParamsFromURL } from "_/routing/paramFromURL"
import { StrategyKey } from "@workspace/models"
import { useMemo } from "react"

export function useStrategyKey(): {
	strategyKey: StrategyKey | undefined
	strategyId: StrategyKey["strategyId"] | undefined
	strategyKind: StrategyKey["strategyKind"] | undefined
} {
	return useMemo(() => {
		const url = new URL(location.href)
		const strategyKey = strategyKeyParamsFromURL(url)
		if (!strategyKey)
			return {
				strategyKey: undefined,
				strategyId: undefined,
				strategyKind: undefined
			}
		return {
			strategyKey,
			strategyId: strategyKey.strategyId,
			strategyKind: strategyKey.strategyKind
		}
	}, [])
}
