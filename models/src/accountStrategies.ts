import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import {
	AccountStrategy,
	AccountStrategyKey,
	AccountStrategySchedulingKey,
	isAccountStrategy
} from "./accountStrategy.js"
import { isItemId } from "./item.js"
import { StrategyMemory } from "./strategyMemory.js"
import { isStrategySchedulings } from "./strategyScheduling.js"
import { CreationTime, DeletionTime, UpdateTime } from "./time.js"

type AccountStrategyItemKey = Omit<AccountStrategyKey, "strategyKind">

// TODO this should be removed
// there could be mixed versions of account strategies in Array
// it must be handled (by consumer) item by item with isAccountStrategy
export const isAccountStrategies =
	arrayTypeGuard<AccountStrategy>(isAccountStrategy)

export type ReadAccountStrategies = (
	arg: AccountKey
) => Promise<AccountStrategy[]>

type InsertAccountStrategiesItemInput = AccountKey & {
	item: AccountStrategy
}

export type InsertAccountStrategiesItem = (
	arg: InsertAccountStrategiesItemInput
) => Promise<CreationTime>

type RenameAccountStrategiesItemInput = AccountStrategyItemKey &
	Pick<AccountStrategy, "name">

export type RenameAccountStrategiesItem = (
	arg: RenameAccountStrategiesItemInput
) => Promise<UpdateTime>

type WriteAccountStrategiesItemSchedulingsInput = AccountStrategyItemKey &
	Pick<AccountStrategy, "schedulings">

export const isWriteAccountStrategiesItemSchedulingsInput =
	objectTypeGuard<WriteAccountStrategiesItemSchedulingsInput>(
		({ accountId, strategyId, schedulings }) =>
			isItemId(accountId) &&
			isItemId(strategyId) &&
			isStrategySchedulings(schedulings)
	)

export type WriteAccountStrategiesItemSchedulings = (
	arg: WriteAccountStrategiesItemSchedulingsInput
) => Promise<UpdateTime>

export type DeleteAccountStrategiesItem = (
	arg: AccountStrategyItemKey
) => Promise<DeletionTime>

export type SuspendAccountStrategyScheduling = (
	arg: AccountStrategySchedulingKey
) => Promise<UpdateTime>

export type SuspendAccountStrategySchedulings = (
	arg: AccountStrategyItemKey
) => Promise<UpdateTime>

export type SuspendAccountStrategiesSchedulings = (
	arg: AccountKey
) => Promise<UpdateTime>

export type UpdateAccountStrategySchedulingMemory = (
	arg: AccountStrategySchedulingKey & { memory: StrategyMemory }
) => Promise<UpdateTime>
