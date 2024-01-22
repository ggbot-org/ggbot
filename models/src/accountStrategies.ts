import { AccountStrategy, AccountStrategyKey } from "./accountStrategy.js"
import { ErrorExceededQuota } from "./errors.js"
import { Modifier } from "./modifier.js"
import { quota } from "./quotas.js"
import { SubscriptionPlan } from "./subscription.js"

export type AccountStrategyItemKey = Omit<AccountStrategyKey, "strategyKind">

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
