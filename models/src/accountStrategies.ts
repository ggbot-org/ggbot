import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import {
	AccountStrategy,
	AccountStrategyKey,
	isAccountStrategy
} from "./accountStrategy.js"
import { isItemId } from "./item.js"
import { isStrategySchedulings } from "./strategyScheduling.js"
import { CreationTime, DeletionTime, UpdateTime } from "./time.js"

type AccountStrategyItemKey = Omit<AccountStrategyKey, "strategyKind">

export type AccountStrategies = AccountStrategy[]

export const isAccountStrategies =
	arrayTypeGuard<AccountStrategy>(isAccountStrategy)

export type ReadAccountStrategies = (
	arg: AccountKey
) => Promise<AccountStrategies>

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

export type SuspendAccountStrategiesSchedulings = (
	arg: AccountKey
) => Promise<UpdateTime>
