import { isStrategyKey, StrategyKey } from "@workspace/models"

export const accountKeyParamsFromURL = (url: URL): StrategyKey | undefined => {
	const strategyKey = {
		strategyId: url.searchParams.get("strategyId"),
		strategyKind: url.searchParams.get("strategyKind")
	}

	if (isStrategyKey(strategyKey)) return strategyKey
}

export const strategyKeyParamsFromURL = (url: URL): StrategyKey | undefined => {
	const strategyKey = {
		strategyId: url.searchParams.get("strategyId"),
		strategyKind: url.searchParams.get("strategyKind")
	}

	if (isStrategyKey(strategyKey)) return strategyKey
}
