import { InvalidStrategyKey } from "_/components/InvalidStrategyKey.js"
import { Section } from "_/components/library"
import { StrategyNotFound } from "_/components/StrategyNotFound.js"
import { usePublicApi } from "_/hooks/usePublicApi.js"
import { strategyKeyParamsFromCurrentLocation } from "_/routing/strategyKeyParams.js"
import { localWebStorage } from "_/storages/local.js"
import { noneStrategy, Strategy } from "@ggbot2/models"
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react"

type ContextValue = {
	// If `strategyKey` is not valid or no `strategy` was found, `children` are not rendered.
	strategy: Strategy
	updateStrategyName: (name: string) => void
}

export const StrategyContext = createContext<ContextValue>({
	strategy: noneStrategy,
	updateStrategyName: () => {}
})

StrategyContext.displayName = "StrategyContext"

export const StrategyProvider: FC<PropsWithChildren> = ({ children }) => {
	const strategyKey = strategyKeyParamsFromCurrentLocation()

	const [name, setName] = useState("")

	const READ_STRATEGY = usePublicApi.ReadStrategy()
	const remoteStrategy = READ_STRATEGY.data

	const strategy = useMemo(() => {
		if (!strategyKey) return noneStrategy
		if (remoteStrategy)
			return name ? { ...remoteStrategy, name } : remoteStrategy
		const localStrategy = localWebStorage.strategy.get(
			strategyKey.strategyId
		)
		if (localStrategy)
			return name ? { ...localStrategy, name } : localStrategy
		return {
			...noneStrategy,
			id: strategyKey.strategyId,
			kind: strategyKey.strategyKind
		}
	}, [remoteStrategy, strategyKey, name])

	const updateStrategyName = useCallback<ContextValue["updateStrategyName"]>(
		(name) => {
			setName(name)
			localWebStorage.strategy.set({ ...strategy, name })
		},
		[strategy]
	)

	const contextValue = useMemo<ContextValue>(
		() => ({
			strategy,
			updateStrategyName
		}),
		[strategy, updateStrategyName]
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
