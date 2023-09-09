import { InvalidStrategyKey } from "_/components/InvalidStrategyKey.js"
import { Section } from "_/components/library"
import { StrategyNotFound } from "_/components/StrategyNotFound.js"
import { usePublicApi } from "_/hooks/usePublicApi.js"
import { strategyKeyParamsFromCurrentLocation } from "_/routing/strategyKeyParams.js"
import { noneStrategy, Strategy } from "@ggbot2/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = {
	// If `strategyKey` is not valid or no `strategy` was found, `children` are not rendered.
	strategy: Strategy
}

export const StrategyContext = createContext<ContextValue>({
	strategy: noneStrategy
})

StrategyContext.displayName = "StrategyContext"

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
	const strategyKey = strategyKeyParamsFromCurrentLocation()

	const READ_STRATEGY = usePublicApi.ReadStrategy()
	const strategy = READ_STRATEGY.data

	const contextValue = useMemo<ContextValue>(
		() => ({
			strategy: strategy ?? {
				...noneStrategy,
				id: strategyKey?.strategyId ?? noneStrategy.id,
				kind: strategyKey?.strategyKind ?? noneStrategy.kind
			}
		}),
		[strategy, strategyKey]
	)

	// Fetch strategy.
	useEffect(() => {
		if (!strategyKey) return
		if (READ_STRATEGY.canRun) READ_STRATEGY.request(strategyKey)
	}, [READ_STRATEGY, strategyKey])

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
