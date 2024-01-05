import { isStrategyKey, StrategyKey } from "@workspace/models"

export const strategyKeyParamsFromURL = (url: URL): StrategyKey | undefined => {
	const strategyKey = {
		strategyId: url.searchParams.get("strategyId"),
		strategyKind: url.searchParams.get("strategyKind")
	}

	if (isStrategyKey(strategyKey)) return strategyKey
}
