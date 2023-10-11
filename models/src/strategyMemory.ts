import { Dflow, DflowObject } from "dflow"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { DeletionTime, isUpdateTime, UpdateTime } from "./time.js"

export type StrategyMemory = UpdateTime & {
	memory: DflowObject
}

export const isStrategyMemory = objectTypeGuard<StrategyMemory>(
	({ memory, ...updateTime }) =>
		Dflow.isObject(memory) && isUpdateTime(updateTime)
)

type ReadStrategyMemoryInput = AccountStrategyKey

export const isReadStrategyMemoryInput = isAccountStrategyKey

export type ReadStrategyMemory = (
	arg: ReadStrategyMemoryInput
) => Promise<StrategyMemory | null>

type WriteStrategyMemoryInput = AccountStrategyKey &
	Omit<StrategyMemory, "whenUpdated">

export type WriteStrategyMemory = (
	arg: WriteStrategyMemoryInput
) => Promise<UpdateTime>

export type DeleteStrategyMemory = (
	arg: AccountStrategyKey
) => Promise<DeletionTime>
