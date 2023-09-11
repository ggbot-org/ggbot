import {
	isLiteralType,
	NaturalNumber,
	objectTypeGuard
} from "@workspace/type-utils"
import { DayInterval, getDay, isDay, today } from "minimal-time-helpers"

import { AccountKey } from "./account.js"
import { Currency } from "./currency.js"
import { UpdateTime } from "./time.js"

export const monthlyPrice = 10

export const purchaseCurrency: Currency = "EUR"
export const purchaseDefaultNumMonths = 6
export const purchaseMaxNumMonths = 12
export const purchaseMinNumMonths = 1

export const shouldPurchaseSubscription = (
	subscription: Subscription
): boolean => {
	const numDaysBeforeSubscriptionEnd = 30
	return (
		getDay(subscription.end).minus(numDaysBeforeSubscriptionEnd).days <
		today()
	)
}

export const totalPurchase = (numMonths: NaturalNumber) => {
	// if 12 months, apply discount.
	if (numMonths === 12) return monthlyPrice * 11
	return numMonths * monthlyPrice
}

const subscriptionPlans = ["basic"] as const
export type SubscriptionPlan = (typeof subscriptionPlans)[number]
export const isSubscriptionPlan =
	isLiteralType<SubscriptionPlan>(subscriptionPlans)

export const subscriptionStatuses = ["active", "expired"] as const
export type SubscriptionStatus = (typeof subscriptionStatuses)[number]
export const isSubscriptionStatus =
	isLiteralType<SubscriptionStatus>(subscriptionStatuses)

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

export type WriteSubscriptionInput = AccountKey & Subscription

export type WriteSubscription = (
	arg: WriteSubscriptionInput
) => Promise<UpdateTime>
