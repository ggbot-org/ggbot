import { FlowViewSerializableGraph } from "flow-view"

import { UpdateTime } from "./time.js"

export type StrategyFlow = UpdateTime & {
	view: FlowViewSerializableGraph
}

// TODO this should be implemented by flow-view
// it is also a dummy implementation
export const isFlowViewSerializableGraph = (
	arg: unknown
): arg is FlowViewSerializableGraph => Boolean(arg)

// TODO welcomeFlow should contain "docs" node
export const welcomeFlow: StrategyFlow["view"] = {
	nodes: [
		{
			id: "aaaaa",
			text: "candles",
			ins: [
				{
					id: "i0"
				},
				{
					id: "i1"
				},
				{
					id: "i2"
				}
			],
			outs: [
				{
					id: "o0"
				},
				{
					id: "o1"
				},
				{
					id: "o2"
				},
				{
					id: "o3"
				},
				{
					id: "o4"
				}
			],
			x: 100,
			y: 100
		}
	],
	edges: []
}
