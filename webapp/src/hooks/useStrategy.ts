import { useReadStrategy } from "_/hooks/public/api"
import { sessionWebStorage } from "_/storages/session"
import { Strategy, StrategyKey } from "@workspace/models"
import { useCallback, useEffect, useState } from "react"

export function useStrategy(strategyKey: StrategyKey | undefined) {
	const { data, canRun, request, reset } = useReadStrategy()

	const [strategy, setStrategy] = useState<Strategy | undefined>(
		strategyKey ? sessionWebStorage.strategy(strategyKey).get() : undefined
	)

	const resetStrategy = useCallback(() => {
		if (!strategyKey) return
		sessionWebStorage.strategy(strategyKey).delete()
		reset()
	}, [reset, strategyKey])

	// Store strategy in web storage.
	useEffect(() => {
		if (!strategyKey) return
		if (canRun) request(strategyKey)
	}, [canRun, request, strategyKey])

	// Store strategy in web storage.
	useEffect(() => {
		if (!strategyKey) return
		if (!data) return
		sessionWebStorage.strategy(strategyKey).set(data)
		setStrategy(data)
	}, [data, strategyKey])

	// Handle case when account strategies changes or is deleted from localWebStorage in other tabs.
	const onLocalStorageChange = useCallback(() => {
		if (!strategyKey) return
		setStrategy(sessionWebStorage.strategy(strategyKey).get())
	}, [strategyKey])
	useEffect(() => {
		addEventListener("storage", onLocalStorageChange)
		return () => {
			removeEventListener("storage", onLocalStorageChange)
		}
	}, [onLocalStorageChange])

	return {
		strategy,
		strategyName: strategy?.name ?? "",
		resetStrategy
	}
}
