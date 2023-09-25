import { Dflow, DflowObject } from "dflow"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountStrategyKey } from "./accountStrategy.js"
import { DeletionTime, isUpdateTime, UpdateTime } from "./time.js"

export type StrategyMemory = UpdateTime & {
	memory: DflowObject
}

export const isStrategyMemory = objectTypeGuard<StrategyMemory>(
	({ memory, ...updateTime }) =>
		Dflow.isObject(memory) && isUpdateTime(updateTime)
)

export type ReadStrategyMemory = (
	arg: AccountStrategyKey
) => Promise<StrategyMemory | null>

type WriteStrategyMemoryInput = AccountStrategyKey &
	Omit<StrategyMemory, "whenUpdated">

export type WriteStrategyMemory = (
	arg: WriteStrategyMemoryInput
) => Promise<UpdateTime>

export type DeleteStrategyMemory = (
	arg: AccountStrategyKey
) => Promise<DeletionTime>
