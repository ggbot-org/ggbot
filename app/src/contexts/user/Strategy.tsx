import { Section } from "@ggbot2/design"
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

import { InvalidStrategyKey } from "../../components/InvalidStrategyKey.js"
import { StrategyNotFound } from "../../components/StrategyNotFound.js"
import { usePublicApi } from "../../hooks/usePublicApi.js"
import { strategyKeyParamsFromCurrentLocation } from "../../routing/strategyKeyParams.js"
import { localWebStorage } from "../../storages/local.js"

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
	const strategyId = strategyKey?.strategyId

	const [name, setName] = useState("")

	const READ_STRATEGY = usePublicApi.ReadStrategy()
	const remoteStrategy = READ_STRATEGY.data

	const strategy = useMemo(() => {
		if (!strategyId) return noneStrategy
		if (remoteStrategy)
			return name ? { ...remoteStrategy, name } : remoteStrategy
		const localStrategy = localWebStorage.strategy.get(strategyId)
		if (localStrategy)
			return name ? { ...localStrategy, name } : localStrategy
		return noneStrategy
	}, [remoteStrategy, strategyId, name])

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
		if (!strategyId) return
		if (remoteStrategy) localWebStorage.strategy.set(remoteStrategy)
		if (remoteStrategy === null) localWebStorage.strategy.delete(strategyId)
	}, [remoteStrategy, strategyId])

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
