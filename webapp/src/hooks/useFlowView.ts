// TODO remove switch in this file, when upgrading flow-view
import { binance } from "_/binance/exchange"
import { initializeFlowView } from "_/flow/initializeFlowView"
import { DflowBinanceClient, DflowBinanceClientDummy, DflowBinanceHost, getDflowBinanceNodesCatalog, parsePercentage } from "@workspace/dflow"
import { StrategyKind } from "@workspace/models"
import { DflowErrorCannotConnectSourceToTarget, DflowNodesCatalog, DflowNodeUnknown } from "dflow"
import { FlowView, FlowViewOnChangeArg, FlowViewOnChangeDataEdge, FlowViewOnChangeDataNode, FlowViewOnChangeInfo, FlowViewSerializableGraph } from "flow-view"
import { now, Time, truncateTime } from "minimal-time-helpers"
import { useCallback, useEffect, useState } from "react"

import { useBinanceSymbols } from "./useBinanceSymbols"

export type UseFlowViewOutput = {
	whenUpdatedFlowView: Time | undefined
	flowViewGraph: FlowViewSerializableGraph | undefined
}

class BinanceClient extends DflowBinanceClientDummy implements DflowBinanceClient {
	async exchangeInfo() {
		return binance.exchangeInfo()
	}
}

export function useFlowView(
	container: HTMLDivElement | null,
	initialFlowViewGraph: FlowViewSerializableGraph | null | undefined,
	strategyKind: StrategyKind | undefined,
) {
	const [output, setOutput] = useState<UseFlowViewOutput>({ whenUpdatedFlowView: undefined, flowViewGraph: undefined })
	const [flowView, setFlowView] = useState<FlowView | undefined>()

	const binanceSymbols = useBinanceSymbols(strategyKind)

	const initializeBinanceFlowView = useCallback((container: HTMLDivElement, nodesCatalog: DflowNodesCatalog): FlowView => {
		const time = truncateTime(now()).to.minute
		const binance = new BinanceClient()
		const dflow = new DflowBinanceHost(
			{ nodesCatalog },
			{ binance, defaults: {}, params: {}, memory: {}, time }
		)

		const flowView = initializeFlowView(container, nodesCatalog)

		function onChangeFlowView({ action, data }: FlowViewOnChangeArg, info: FlowViewOnChangeInfo) {
			try {
				if (!flowView) return
				const { isLoadGraph, isProgrammatic } = info
				const isUserInput = !isLoadGraph && !isProgrammatic

				switch (action) {
					case "CREATE_EDGE": {
						const { id, from, to } = data as FlowViewOnChangeDataEdge
						dflow.newEdge({ id, source: from, target: to })
						if (isUserInput) setOutput({ whenUpdatedFlowView: now(), flowViewGraph: flowView.graph })
						break
					}

					case "CREATE_NODE": {
						const { text, type, id, ins, outs } = data as FlowViewOnChangeDataNode
						switch (type) {
							case "info":
								break
							case "json": {
								const outputId = outs?.[0]?.id
								dflow.newNode({
									id,
									kind: "data",
									outputs: [{ data: JSON.parse(text), id: outputId }]
								})
								break
							}
							case "perc": {
								const outputId = outs?.[0]?.id
								dflow.newNode({
									id,
									kind: "data",
									outputs: [{ data: parsePercentage(text), id: outputId }]
								})
								break
							}
							default: {
								const kind = text
								const node = dflow.newNode({
									id,
									kind,
									inputs: ins?.map(({ id }) => ({ id })),
									outputs: outs?.map(({ id }) => ({ id }))
								})

								if (node instanceof DflowNodeUnknown) {
									flowView.node(id).hasError = true
									break
								}

								// Complete node inputs and outputs.

								const NodeClass = nodesCatalog[kind]
								const { inputs = [], outputs = [] } = NodeClass
								const nodeView = flowView.node(id)

								for (let i = 0; i < inputs.length; i++) {
									const name = inputs[i].name
									if (nodeView.inputs[i]) {
										nodeView.inputs[i].name = name
										nodeView.inputs[i].text = name
									} else {
										nodeView.newInput({ id: node.input(i).id as string, name })
									}
								}

								for (let i = 0; i < outputs.length; i++) {
									const name = outputs[i].name
									if (nodeView.outputs[i]) {
										nodeView.outputs[i].name = name
										nodeView.outputs[i].text = name
									} else {
										nodeView.newOutput({ id: node.output(i).id as string, name })
									}
								}

								break
							}
						}
						if (isUserInput) setOutput({ whenUpdatedFlowView: now(), flowViewGraph: flowView.graph })
						break
					}

					case "DELETE_EDGE":
					case "DELETE_NODE":
					case "UPDATE_NODE":
						if (isUserInput) setOutput({ whenUpdatedFlowView: now(), flowViewGraph: flowView.graph })
						break

					default: break
				}
			} catch (error) {
				console.error(error)
				if (action === "CREATE_EDGE") {
					if (typeof data !== "object" || data === null) return
					const edgeId = data.id
					if (typeof edgeId !== "string") return
					if (error instanceof DflowErrorCannotConnectSourceToTarget) {
						flowView.deleteEdge(edgeId)
						return
					}
					const viewEdge = flowView.edge(edgeId)
					viewEdge.hasError = true
				}
				if (action === "CREATE_NODE") {
					if (typeof data !== "object" || data === null) return
					const nodeId = data.id
					if (typeof nodeId !== "string") return
					const viewNode = flowView.node(nodeId)
					viewNode.hasError = true
				}
			}
		}

		flowView.onChange(onChangeFlowView)

		return flowView
	}, [])

	// Initialize flow-view.
	useEffect(() => {
		if (flowView) return
		if (!container) return
		if (strategyKind === "binance") {
			if (!binanceSymbols) return
			setFlowView(initializeBinanceFlowView(container, getDflowBinanceNodesCatalog(binanceSymbols)))
		}
	}, [binanceSymbols, container, flowView, initializeBinanceFlowView, strategyKind])

	// Load initial graph.
	useEffect(() => {
		if (!flowView) return
		if (!initialFlowViewGraph) return
		flowView.clearGraph()
		flowView.loadGraph(initialFlowViewGraph)
		setOutput({ whenUpdatedFlowView: now(), flowViewGraph: initialFlowViewGraph })
	}, [flowView, initialFlowViewGraph])

	// Dispose.
	// TODO
	// useEffect(() => flowView?.destroy, [flowView]);

	return output
}
