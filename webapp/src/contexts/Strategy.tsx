// TODO move this into useStrategy hook
import { InvalidStrategyKey } from "_/components/InvalidStrategyKey"
import { Section } from "_/components/library"
import { StrategyNotFound } from "_/components/StrategyNotFound"
import { useReadStrategy } from "_/hooks/public/api"
import { useStrategyKey } from "_/hooks/useStrategyKey"
import { localWebStorage } from "_/storages/local"
import { Strategy, StrategyKey, StrategyKind } from "@workspace/models"
import { createContext, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = {
	strategy: Strategy | null | undefined
	strategyKey: StrategyKey | undefined
	strategyKind: StrategyKind | undefined
	strategyId: Strategy["id"] | undefined
	strategyName: string
	resetStrategy: () => void
}

export const StrategyContext = createContext<ContextValue>({
	strategy: undefined,
	strategyKey: undefined,
	strategyKind: undefined,
	strategyId: undefined,
	strategyName: "",
	resetStrategy: () => {}
})

StrategyContext.displayName = "StrategyContext"

export function StrategyProvider({ children }: PropsWithChildren) {
	const { strategyKey } = useStrategyKey()

	const READ = useReadStrategy()
	const { data: remoteStrategy, reset } = READ

	const contextValue = useMemo<ContextValue>(() => {
		let strategy
		if (remoteStrategy) {
			strategy = remoteStrategy
		} else if (strategyKey) {
			strategy = localWebStorage.strategy(strategyKey.strategyId).get()
		}

		return {
			strategy,
			strategyKey: strategy
				? { strategyId: strategy.id, strategyKind: strategy.kind }
				: undefined,
			strategyKind: strategy?.kind,
			strategyId: strategy?.id,
			strategyName: strategy?.name ?? "",
			resetStrategy: () => {
				if (!strategyKey) return
				localWebStorage.strategy(strategyKey.strategyId).delete()
				reset()
			}
		}
	}, [strategyKey, remoteStrategy, reset])

	const { strategy } = contextValue

	// Fetch strategy.
	useEffect(() => {
		if (!strategyKey) return
		if (READ.canRun) READ.request(strategyKey)
	}, [READ, strategyKey])

	// Cache strategy.
	useEffect(() => {
		if (!strategyKey) return
		const { strategyId } = strategyKey
		if (remoteStrategy)
			localWebStorage.strategy(strategyId).set(remoteStrategy)
		if (remoteStrategy === null)
			localWebStorage.strategy(strategyId).delete()
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
