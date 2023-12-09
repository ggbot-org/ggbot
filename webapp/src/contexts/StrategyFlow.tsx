import { FlowViewContainerElement } from "_/components/FlowViewContainer"
import { StrategyContext } from "_/contexts/Strategy"
import {
	useFlowView,
	UseFlowViewArg,
	UseFlowViewOutput
} from "_/hooks/useFlowView"
import { usePublicApi } from "_/hooks/usePublicApi"
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
	whenUpdatedFlowView: undefined,
	flowViewGraph: undefined,
	flowViewContainerRef: { current: null }
})

StrategyFlowContext.displayName = "StrategyFlowContext"

export const StrategyFlowProvider: FC<PropsWithChildren> = ({ children }) => {
	const { strategyKey, strategyKind } = useContext(StrategyContext)

	const flowViewContainerRef = useRef<FlowViewContainerElement>(null)

	const READ = usePublicApi.ReadStrategyFlow()

	let initialFlowViewGraph: UseFlowViewArg["initialFlowViewGraph"]
	if (READ.data === null) initialFlowViewGraph = null
	if (READ.data) initialFlowViewGraph = READ.data.view

	const { whenUpdatedFlowView, flowViewGraph } = useFlowView({
		container: flowViewContainerRef.current,
		initialFlowViewGraph,
		strategyKind
	})

	const contextValue = useMemo<ContextValue>(
		() => ({ whenUpdatedFlowView, flowViewGraph, flowViewContainerRef }),
		[whenUpdatedFlowView, flowViewGraph, flowViewContainerRef]
	)

	// Fetch flow.
	useEffect(() => {
		if (!strategyKey) return
		if (READ.canRun) READ.request(strategyKey)
	}, [READ, strategyKey])

	return (
		<StrategyFlowContext.Provider value={contextValue}>
			{children}
		</StrategyFlowContext.Provider>
	)
}
