import { FlowViewSerializableGraph } from "flow-view"
import { isMaybeObject, objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { isStrategyKey, StrategyKey } from "./strategy.js"
import { CreationTime, DeletionTime, isUpdateTime, UpdateTime } from "./time.js"

export type StrategyFlow = UpdateTime & {
	view: FlowViewSerializableGraph
}

export const isStrategyFlow = objectTypeGuard<StrategyFlow>(
	({ view, ...updateTime }) =>
		isMaybeObject<FlowViewSerializableGraph>(view) &&
		isUpdateTime(updateTime)
	//TODO is FlowViewSerializableGraph(view)
)

type CopyStrategyFlowInput = AccountKey & {
	source: StrategyKey
	target: StrategyKey
}

export type CopyStrategyFlow = (
	arg: CopyStrategyFlowInput
) => Promise<CreationTime>

export const isReadStrategyFlowInput = isStrategyKey

export type ReadStrategyFlow = (
	arg: StrategyKey
) => Promise<StrategyFlow | null>

type WriteStrategyFlowInput = AccountStrategyKey &
	Omit<StrategyFlow, "whenUpdated">

//TODO is FlowViewSerializableGraph(view)
export const isWriteStrategyFlowInput = objectTypeGuard<WriteStrategyFlowInput>(
	({ view, ...accountStrategyKey }) =>
		isMaybeObject<FlowViewSerializableGraph>(view) &&
		isAccountStrategyKey(accountStrategyKey)
)

export type WriteStrategyFlow = (
	arg: WriteStrategyFlowInput
) => Promise<UpdateTime>

export type DeleteStrategyFlow = (
	arg: AccountStrategyKey
) => Promise<DeletionTime>
