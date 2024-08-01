import { objectTypeGuard } from "minimal-type-guard-helpers"

import { updatedNow, UpdateTime } from "./time.js"

type StrategyFlowViewItem = {
	id: string
}

type StrategyFlowViewOutput = StrategyFlowViewItem
type StrategyFlowViewInput = StrategyFlowViewItem

type StrategyFlowViewNode = StrategyFlowViewItem & {
	text: string

	/** List of input definitions. */
	ins?: StrategyFlowViewInput[]

	/** List of output definitions. */
	outs?: StrategyFlowViewOutput[]

	/** Node position x coordinate. */
	x: number

	/** Node position y coordinate. */
	y: number
}

type StrategyFlowViewEdge = StrategyFlowViewItem & {
	/** Describes the output where edge starts from. */
	from: [StrategyFlowViewNode["id"], StrategyFlowViewOutput["id"]]

	/** Describes the input where edge ends to. */
	to: [StrategyFlowViewNode["id"], StrategyFlowViewInput["id"]]
}

type StrategyFlowView = {
	nodes: StrategyFlowViewNode[]
	edges: StrategyFlowViewEdge[]
}

export type StrategyFlowGraphEdge = Pick<
	StrategyFlowViewEdge,
	"id" | "from" | "to"
>
export type StrategyFlowGraphNode = Pick<
	StrategyFlowViewNode,
	"id" | "text" | "ins" | "outs"
>

export type StrategyFlowGraph = {
	nodes: StrategyFlowGraphNode[]
	edges: StrategyFlowGraphEdge[]
}

// TODO Improve this
export const isStrategyFlowGraph = objectTypeGuard<StrategyFlowGraph>(
	({ edges, nodes }) => Array.isArray(edges) && Array.isArray(nodes)
)

export type StrategyFlow = UpdateTime & {
	view: StrategyFlowView
	// TODO graph: StrategyFlowGraph
	// and parse the graph to get the view and viceversa
}

export function newStrategyFlow({
	view
}: Pick<StrategyFlow, "view">): StrategyFlow {
	return {
		view,
		...updatedNow()
	}
}

export function isStrategyFlowView(arg: unknown): arg is StrategyFlowView {
	return Boolean(arg) // TODO improve this or remove type-guard
}

// TODO welcomeFlow should contain "docs" node
export const welcomeFlow: StrategyFlowView = {
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
