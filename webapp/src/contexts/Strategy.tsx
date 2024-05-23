import { InvalidStrategyKey } from "_/components/InvalidStrategyKey"
import { Section } from "_/components/library"
import { StrategyNotFound } from "_/components/StrategyNotFound"
import { usePublicApi } from "_/hooks/usePublicApi"
import { strategyKeyParamsFromURL } from "_/routing/paramFromURL"
import { localWebStorage } from "_/storages/local"
import { Strategy, StrategyKey, StrategyKind } from "@workspace/models"
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo
} from "react"

type ContextValue = {
	strategy: Strategy | null | undefined
	strategyKey: StrategyKey | undefined
	strategyKind: StrategyKind | undefined
	strategyId: Strategy["id"] | undefined
	strategyName: string
	refetchStrategy: () => void
}

export const StrategyContext = createContext<ContextValue>({
	strategy: undefined,
	strategyKey: undefined,
	strategyKind: undefined,
	strategyId: undefined,
	strategyName: "",
	refetchStrategy: () => {}
})

StrategyContext.displayName = "StrategyContext"

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
	const strategyKey = strategyKeyParamsFromURL(new URL(location.href))

	const READ = usePublicApi.ReadStrategy()
	const remoteStrategy = READ.data

	const refetchStrategy = useCallback(() => {
		if (!strategyKey) return
		localWebStorage.strategy(strategyKey.strategyId).delete()
		READ.reset()
	}, [READ, strategyKey])

	const strategy = useMemo<ContextValue["strategy"]>(() => {
		if (!strategyKey) return undefined
		if (remoteStrategy) return remoteStrategy
		const localStrategy = localWebStorage
			.strategy(strategyKey.strategyId)
			.get()
		if (localStrategy) return localStrategy
	}, [remoteStrategy, strategyKey])

	const contextValue = useMemo<ContextValue>(
		() => ({
			strategy,
			strategyKey: strategy
				? { strategyId: strategy.id, strategyKind: strategy.kind }
				: undefined,
			strategyKind: strategy?.kind,
			strategyId: strategy?.id,
			strategyName: strategy?.name ?? "",
			refetchStrategy
		}),
		[strategy, refetchStrategy]
	)

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
