import { InvalidStrategyKey } from "_/components/InvalidStrategyKey"
import { Section } from "_/components/library"
import { StrategyNotFound } from "_/components/StrategyNotFound"
import { usePublicApi } from "_/hooks/usePublicApi"
import { strategyKeyParamsFromCurrentLocation } from "_/routing/strategyKeyParams"
import { localWebStorage } from "_/storages/local"
import { Strategy } from "@workspace/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = {
	strategy: Strategy | null | undefined
}

export const StrategyContext = createContext<ContextValue>({
	strategy: undefined
})

StrategyContext.displayName = "StrategyContext"

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
	const strategyKey = strategyKeyParamsFromCurrentLocation()

	const READ_STRATEGY = usePublicApi.ReadStrategy()
	const remoteStrategy = READ_STRATEGY.data

	const strategy = useMemo<ContextValue["strategy"]>(() => {
		if (!strategyKey) return undefined
		if (remoteStrategy) return remoteStrategy
		const localStrategy = localWebStorage.strategy.get(
			strategyKey.strategyId
		)
		if (localStrategy) return localStrategy
	}, [remoteStrategy, strategyKey])

	const contextValue = useMemo<ContextValue>(
		() => ({
			strategy
		}),
		[strategy]
	)

	// Fetch strategy.
	useEffect(() => {
		if (!strategyKey) return
		if (READ_STRATEGY.canRun) READ_STRATEGY.request(strategyKey)
	}, [READ_STRATEGY, strategyKey])

	// Cache strategy.
	useEffect(() => {
		if (!strategyKey) return
		if (remoteStrategy) localWebStorage.strategy.set(remoteStrategy)
		if (remoteStrategy === null)
			localWebStorage.strategy.delete(strategyKey.strategyId)
	}, [remoteStrategy, strategyKey])

	if (!strategyKey)
		return (
			<Section>
				<InvalidStrategyKey />
			</Section>
		)

	if (strategy === undefined) return null

	if (strategy === null)
		return (
			<Section>
				<StrategyNotFound {...strategyKey} />
			</Section>
		)

	return (
		<StrategyContext.Provider value={contextValue}>
			{children}
		</StrategyContext.Provider>
	)
}
