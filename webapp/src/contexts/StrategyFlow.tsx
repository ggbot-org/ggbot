import { FlowViewContainerElement } from "_/components/FlowViewContainer"
import { StrategyContext } from "_/contexts/Strategy"
import { useFlowView, UseFlowViewOutput } from "_/hooks/useFlowView"
import { usePublicApi } from "_/hooks/usePublicApi"
import { isStrategyFlow } from "@workspace/models"
import { FlowViewSerializableGraph } from "flow-view"
import {
	createContext,
	FC,
	MutableRefObject,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useRef
} from "react"

type ContextValue = UseFlowViewOutput & {
	flowViewContainerRef: MutableRefObject<FlowViewContainerElement>
}

export const StrategyFlowContext = createContext<ContextValue>({
	whenUpdatedFlowView: 0,
	flowViewGraph: undefined,
	flowViewContainerRef: { current: null }
})

StrategyFlowContext.displayName = "StrategyFlowContext"

export const StrategyFlowProvider: FC<PropsWithChildren> = ({ children }) => {
	const { strategyKey, strategyKind } = useContext(StrategyContext)

	const flowViewContainerRef = useRef<FlowViewContainerElement>(null)

	const READ_STRATEGY_FLOW = usePublicApi.ReadStrategyFlow()

	const flow = useMemo(() => {
		if (
			isStrategyFlow(READ_STRATEGY_FLOW.data) ||
			READ_STRATEGY_FLOW.data === null
		)
			return READ_STRATEGY_FLOW.data
	}, [READ_STRATEGY_FLOW])

	const { whenUpdatedFlowView, flowViewGraph } = useFlowView({
		container: flowViewContainerRef.current,
		// TODO need isFlowViewSerializableGraph
		initialGraph: flow?.view as FlowViewSerializableGraph,
		strategyKind
	})

	const contextValue = useMemo<ContextValue>(
		() => ({ whenUpdatedFlowView, flowViewGraph, flowViewContainerRef }),
		[whenUpdatedFlowView, flowViewGraph, flowViewContainerRef]
	)

	// Fetch flow.
	useEffect(() => {
		if (!strategyKey) return
		if (READ_STRATEGY_FLOW.canRun) READ_STRATEGY_FLOW.request(strategyKey)
	}, [READ_STRATEGY_FLOW, strategyKey])

	return (
		<StrategyFlowContext.Provider value={contextValue}>
			{children}
		</StrategyFlowContext.Provider>
	)
}
