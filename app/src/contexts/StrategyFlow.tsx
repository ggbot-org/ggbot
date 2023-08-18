import { isStrategyFlow } from "@ggbot2/models"
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

import { FlowViewContainerElement } from "../components/FlowViewContainer.js"
import { StrategyContext } from "../contexts/Strategy.js"
import { useFlowView, UseFlowViewOutput } from "../hooks/useFlowView.js"
import { usePublicApi } from "../public/hooks/usePublicApi.js"

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
	const { strategy } = useContext(StrategyContext)

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
		initialGraph: flow?.view,
		strategyKind: strategy.kind
	})

	const contextValue = useMemo<ContextValue>(
		() => ({ whenUpdatedFlowView, flowViewGraph, flowViewContainerRef }),
		[whenUpdatedFlowView, flowViewGraph, flowViewContainerRef]
	)

	// Fetch flow.
	useEffect(() => {
		if (READ_STRATEGY_FLOW.canRun)
			READ_STRATEGY_FLOW.request({
				strategyId: strategy.id,
				strategyKind: strategy.kind
			})
	}, [READ_STRATEGY_FLOW, strategy])

	return (
		<StrategyFlowContext.Provider value={contextValue}>
			{children}
		</StrategyFlowContext.Provider>
	)
}
