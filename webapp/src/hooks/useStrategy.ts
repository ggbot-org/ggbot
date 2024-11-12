import { useReadStrategy } from '_/hooks/public/api'
import { sessionWebStorage } from '_/storages/session'
import { Strategy, StrategyKey } from '@workspace/models'
import { useEffect, useState } from 'react'

export function useStrategy(strategyKey: StrategyKey | undefined) {
	const { data, canRun, isPending, request } = useReadStrategy()

	const [strategy, setStrategy] = useState<Strategy | null | undefined>(
		strategyKey ? sessionWebStorage.strategy(strategyKey).get() : undefined
	)

	// Fetch strategy if not found in web storage.
	useEffect(() => {
		if (!strategyKey) return
		if (strategy) return
		if (canRun) request(strategyKey)
	}, [canRun, request, strategyKey])

	// Store strategy in web storage.
	useEffect(() => {
		if (!strategyKey) return
		if (data) {
			setStrategy(data)
			sessionWebStorage.strategy(strategyKey).set(data)
		}
	}, [data, strategyKey])

	return {
		strategy,
		strategyNotFound: strategy === undefined ? undefined : strategy === null,
		strategyName: strategy?.name ?? '',
		strategyId: strategy?.id ?? '',
		strategyWhenCreated: strategy?.whenCreated,
		strategyFrequency: strategy?.frequency,
		readStrategyIsPending: isPending,
	}
}
