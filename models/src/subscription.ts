import { DayInterval, getDay, isDay, today } from "minimal-time-helpers"
import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { FrequencyInterval } from "./frequency.js"

const numDaysBeforeSubscriptionEnd = 30

/**
 * Tolerance for subscription expiration. A subscription will be expired after
 * its expiration date plus this number of days.
 */
export const numDaysSubscriptionExpirationTolerance = 7

export const shouldPurchaseSubscription = (
	subscription: Subscription
): boolean =>
	getDay(subscription.end).minus(numDaysBeforeSubscriptionEnd).days < today()

const subscriptionPlans = ["basic", "pro"] as const
export type SubscriptionPlan = (typeof subscriptionPlans)[number]
export const isSubscriptionPlan =
	isLiteralType<SubscriptionPlan>(subscriptionPlans)

const subscriptionStatuses = ["active", "expired"] as const
export type SubscriptionStatus = (typeof subscriptionStatuses)[number]

export type Subscription = Pick<DayInterval, "end"> & {
	plan: SubscriptionPlan
}

export const isSubscription = objectTypeGuard<Subscription>(
	({ plan, end }) => isSubscriptionPlan(plan) && isDay(end)
)

/**
 * Get subscription status, consireding expiration date and num days of
 * tolerance.
 */
export const statusOfSubscription = ({
	end
}: Pick<Subscription, "end">): SubscriptionStatus =>
	getDay(end).plus(numDaysSubscriptionExpirationTolerance).days >= today()
		? "active"
		: "expired"
// end >= today()? "active" : "expired"

/**
 * Only accounts with "pro" subscription plan can schedule with these frequency
 * intervals.
 */
export const PRO_FREQUENCY_INTERVALS: FrequencyInterval[] = ["1m"]
