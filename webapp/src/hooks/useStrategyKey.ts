import { strategyKeyParamsFromURL } from '_/routing/paramFromURL'

export function useStrategyKey() {
	const strategyKey = strategyKeyParamsFromURL(new URL(location.href))
	return {
		strategyKey,
		strategyId: strategyKey?.strategyId,
		strategyKind: strategyKey?.strategyKind,
	}
}
