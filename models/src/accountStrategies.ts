import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import {
	AccountStrategy,
	AccountStrategyKey,
	AccountStrategySchedulingKey
} from "./accountStrategy.js"
import { ErrorExceededQuota } from "./errors.js"
import { isItemId } from "./item.js"
import { Modifier } from "./modifier.js"
import { quota } from "./quotas.js"
import { StrategyMemory } from "./strategyMemory.js"
import { isStrategySchedulings } from "./strategyScheduling.js"
import { SubscriptionPlan } from "./subscription.js"
import { CreationTime, DeletionTime, UpdateTime } from "./time.js"

type AccountStrategyItemKey = Omit<AccountStrategyKey, "strategyKind">

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

// TODO add and test all other modifiers, see database/src/accountStrategies
export const accountStrategiesModifier: Modifier<AccountStrategy[]> = {
	insertItem(
		previousItems: AccountStrategy[],
		item: AccountStrategy,
		subscriptionPlan: SubscriptionPlan | undefined
	) {
		const accountStrategies = [...previousItems, item]
		// Check num strategies does not exceed quota, according to subscription.
		if (
			accountStrategies.length >
			quota.MAX_STRATEGIES_PER_ACCOUNT(subscriptionPlan)
		)
			throw new ErrorExceededQuota({ type: "MAX_STRATEGIES_PER_ACCOUNT" })
		let numSchedulings = 0

		// Check num schedulings does not exceed quota, according to subscription.
		for (const { schedulings } of accountStrategies)
			numSchedulings += schedulings.length
		if (
			numSchedulings > quota.MAX_SCHEDULINGS_PER_ACCOUNT(subscriptionPlan)
		)
			throw new ErrorExceededQuota({
				type: "MAX_SCHEDULINGS_PER_ACCOUNT"
			})
		return accountStrategies
	}
}
