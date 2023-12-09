import { FlowViewSerializableGraph } from "flow-view"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { StrategyKey } from "./strategy.js"
import { CreationTime, DeletionTime, UpdateTime } from "./time.js"

export type StrategyFlow = UpdateTime & {
	view: FlowViewSerializableGraph
}

type CopyStrategyFlowInput = AccountKey & {
	source: StrategyKey
	target: StrategyKey
}

export type CopyStrategyFlow = (
	arg: CopyStrategyFlowInput
) => Promise<CreationTime>

export type ReadStrategyFlow = (
	arg: StrategyKey
) => Promise<StrategyFlow | null>

type WriteStrategyFlowInput = AccountStrategyKey &
	Omit<StrategyFlow, "whenUpdated">

// TODO this should be implemented by flow-view
// it is also a dummy implementation
const isFlowViewSerializableGraph = (
	arg: unknown
): arg is FlowViewSerializableGraph => !arg

export const isWriteStrategyFlowInput = objectTypeGuard<WriteStrategyFlowInput>(
	({ view, ...accountStrategyKey }) =>
		isFlowViewSerializableGraph(view) &&
		isAccountStrategyKey(accountStrategyKey)
)

export type WriteStrategyFlow = (
	arg: WriteStrategyFlowInput
) => Promise<UpdateTime>

export type DeleteStrategyFlow = (
	arg: AccountStrategyKey
) => Promise<DeletionTime>

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
