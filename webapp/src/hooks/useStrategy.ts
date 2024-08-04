import { useReadStrategy } from "_/hooks/public/api"
import { sessionWebStorage } from "_/storages/session"
import { Strategy, StrategyKey } from "@workspace/models"
import { useCallback, useEffect, useMemo, useState } from "react"

export function useStrategy(strategyKey: StrategyKey | undefined) {
	const { data, canRun, isPending, request, reset } = useReadStrategy()

	const [strategy, setStrategy] = useState<Strategy | null | undefined>(
		strategyKey ? sessionWebStorage.strategy(strategyKey).get() : undefined
	)

	const resetStrategy = useCallback(() => {
		if (!strategyKey) return
		sessionWebStorage.strategy(strategyKey).delete()
		reset()
	}, [reset, strategyKey])

	// Fetch strategy if not found in web storage.
	useEffect(() => {
		if (!strategyKey) return
		if (canRun) request(strategyKey)
	}, [canRun, request, strategyKey])

	// Store strategy in web storage.
	useEffect(() => {
		if (!strategyKey) return
		if (data === undefined) return
		setStrategy(data)
		// Do not store strategy if it is null.
		if (data) sessionWebStorage.strategy(strategyKey).set(data)
	}, [data, strategyKey])

	return useMemo(() => ({
		strategyNotFound: strategy === null,
		strategyName: strategy?.name ?? "",
		strategyId: strategy?.id ?? "",
		strategyWhenCreated: strategy?.whenCreated,
		strategyFrequency: strategy?.frequency,
		readStrategyIsPending: isPending,
		resetStrategy
	}), [isPending, resetStrategy, strategy])
}
