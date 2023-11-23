import { DayInterval, getDay, isDay, today } from "minimal-time-helpers"
import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import { UpdateTime } from "./time.js"

export const shouldPurchaseSubscription = (
	subscription: Subscription
): boolean => {
	const numDaysBeforeSubscriptionEnd = 30
	return (
		getDay(subscription.end).minus(numDaysBeforeSubscriptionEnd).days <
		today()
	)
}

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

export const statusOfSubscription = ({
	end
}: Pick<Subscription, "end">): SubscriptionStatus =>
	end > today() ? "active" : "expired"

export type ReadSubscription = (arg: AccountKey) => Promise<Subscription | null>

type WriteSubscriptionInput = AccountKey & Subscription

export type WriteSubscription = (
	arg: WriteSubscriptionInput
) => Promise<UpdateTime>
