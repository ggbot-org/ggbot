import { AccountStrategy, AccountStrategyKey } from "./accountStrategy.js"
import { ErrorExceededQuota } from "./errors.js"
import { quota } from "./quotas.js"
import { StrategyMemory } from "./strategyMemory.js"
import { StrategyScheduling } from "./strategyScheduling.js"
import { SubscriptionPlan } from "./subscription.js"

export type AccountStrategyItemKey = Omit<AccountStrategyKey, "strategyKind">

// TODO this should be a class, like
// const accountStrategiesModifier = new AccountStrategiesModifier(accountStrategies)
// accountStrategiesModifier.insertAccountStrategy(accountStrategy, subscriptionPlan)

export const accountStrategiesModifier = {
	insertAccountStrategy(
		previousAccountStrategies: AccountStrategy[],
		accountStrategy: AccountStrategy,
		subscriptionPlan: SubscriptionPlan | undefined
	) {
		const accountStrategies = [
			...previousAccountStrategies,
			accountStrategy
		]

		// Check num strategies does not exceed quota, according to subscription.
		if (
			accountStrategies.length >
			quota.MAX_STRATEGIES_PER_ACCOUNT(subscriptionPlan)
		)
			throw new ErrorExceededQuota({ type: "MAX_STRATEGIES_PER_ACCOUNT" })

		// Check num active schedulings does not exceed quota, according to subscription.
		let numSchedulings = 0
		for (const { schedulings } of accountStrategies)
			numSchedulings += schedulings.length
		if (
			numSchedulings > quota.MAX_SCHEDULINGS_PER_ACCOUNT(subscriptionPlan)
		)
			throw new ErrorExceededQuota({
				type: "MAX_SCHEDULINGS_PER_ACCOUNT"
			})

		return accountStrategies
	},

	deleteAccountStrategy(
		accountStrategies: AccountStrategy[],
		strategyId: AccountStrategy["strategyId"]
	) {
		return accountStrategies.filter(
			(item) => item.strategyId !== strategyId
		)
	},

	suspendScheduling(
		accountStrategies: AccountStrategy[],
		strategyId: AccountStrategy["strategyId"],
		schedulingId: StrategyScheduling["id"]
	) {
		return accountStrategies.map((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map<StrategyScheduling>(
							({ status, ...scheduling }) => ({
								...scheduling,
								status:
									schedulingId === scheduling.id
										? "suspended"
										: status
							})
						)
					: item.schedulings
		}))
	},

	suspendStrategySchedulings(
		accountStrategies: AccountStrategy[],
		strategyId: AccountStrategy["strategyId"]
	) {
		return accountStrategies.map((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map<StrategyScheduling>(
							({ status: _status, ...scheduling }) => ({
								...scheduling,
								status: "suspended"
							})
						)
					: item.schedulings
		}))
	},

	updateSchedulingMemory(
		accountStrategies: AccountStrategy[],
		strategyId: AccountStrategy["strategyId"],
		schedulingId: StrategyScheduling["id"],
		memory: StrategyMemory
	) {
		return accountStrategies.map((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map<StrategyScheduling>(
							(scheduling) => ({
								...scheduling,
								memory:
									schedulingId === scheduling.id
										? memory
										: scheduling.memory
							})
						)
					: item.schedulings
		}))
	}
}
