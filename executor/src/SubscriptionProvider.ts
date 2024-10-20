import { CacheMap } from "@workspace/cache"
import { ExecutorDatabase } from "@workspace/database"
import { AccountKey, isSubscription, statusOfSubscription, Subscription, SubscriptionPlan } from "@workspace/models"

import { ONE_DAY } from "./durations.js"

export class SubscriptionProvider {
	readonly cache: CacheMap<Subscription>
	private readonly database: ExecutorDatabase

	constructor(database: ExecutorDatabase) {
		this.cache = new CacheMap<Subscription>(ONE_DAY)
		this.database = database
	}
	/**
	 * Check if subscription is active.
	 */
	async checkSubscription({ accountId }: AccountKey): Promise<{
		hasActiveSubscription: boolean
		subscriptionPlan: SubscriptionPlan | undefined
	}> {
		const cached = this.cache.get(accountId)
		if (cached) return {
			hasActiveSubscription: statusOfSubscription(cached) === "active",
			subscriptionPlan: cached.plan
		}
		const subscription = await this.database.ReadSubscription({ accountId })
		if (!isSubscription(subscription)) return {
			hasActiveSubscription: false,
			subscriptionPlan: undefined
		}
		this.cache.set(accountId, subscription)
		return {
			hasActiveSubscription:
					statusOfSubscription(subscription) === "active",
			subscriptionPlan: subscription.plan
		}
	}
}
