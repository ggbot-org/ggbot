import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { isSerializableObject, SerializableObject } from "./serializable.js"
import { StrategyKey } from "./strategy.js"
import { CreationTime, DeletionTime, isUpdateTime, UpdateTime } from "./time.js"

export type StrategyFlow = UpdateTime & {
	view: SerializableObject
}

export const isStrategyFlow = objectTypeGuard<StrategyFlow>(
	({ view, ...updateTime }) =>
		isSerializableObject(view) && isUpdateTime(updateTime)
)

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

export const isWriteStrategyFlowInput = objectTypeGuard<WriteStrategyFlowInput>(
	({ view, ...accountStrategyKey }) =>
		isSerializableObject(view) && isAccountStrategyKey(accountStrategyKey)
)

export type WriteStrategyFlow = (
	arg: WriteStrategyFlowInput
) => Promise<UpdateTime>

export type DeleteStrategyFlow = (
	arg: AccountStrategyKey
) => Promise<DeletionTime>
