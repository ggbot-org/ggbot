import {
	dateToDay,
	Day,
	DayInterval,
	dayToDate,
	getDate,
	isDay
} from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import { isItemId, Item, newId, NewItem } from "./item.js"
import { NaturalNumber } from "./numbers.js"
import { PaymentProvider } from "./paymentProviders.js"
import { SubscriptionPlan } from "./subscription.js"
import { createdNow, CreationTime, DayKey } from "./time.js"

export const purchaseDefaultNumMonths = 6

/**
 * Maximum number of purchase months. Considering 1 month discount, 11 months is
 * a yearly subscription.
 *
 * @remarks
 * It is bounded in order to renew conditions periodically. For example the
 * purchase may be blocked if the user needs to update its API settings.
 */
export const purchaseMaxNumMonths = 11

/** Minimum number of purchase months. */
export const purchaseMinNumMonths = 1

export type SubscriptionPurchase = Item &
	CreationTime &
	DayInterval & {
		plan: SubscriptionPlan
		paymentProvider: PaymentProvider
	}

export type SubscriptionPurchaseKey = AccountKey &
	DayKey & {
		purchaseId: SubscriptionPurchase["id"]
	}

export const isSubscriptionPurchaseKey =
	objectTypeGuard<SubscriptionPurchaseKey>(
		({ day, accountId, purchaseId }) => isItemId(accountId) && isDay(day) && isItemId(purchaseId)
	)

export function newMonthlySubscriptionPurchase({
	plan,
	paymentProvider,
	startDay,
	numMonths
}: Pick<NewItem<SubscriptionPurchase>, "plan" | "paymentProvider"> & {
	startDay: Day
	numMonths: NaturalNumber
}): SubscriptionPurchase {
	const startDate = dayToDate(startDay)
	const endDate = getDate(startDate).plus(numMonths).months
	const endDay = dateToDay(endDate)
	const dayInterval = { start: startDay, end: endDay }
	return {
		id: newId(),
		paymentProvider,
		plan,
		...createdNow(),
		...dayInterval
	}
}

export function newYearlySubscriptionPurchase({
	plan,
	paymentProvider,
	startDay
}: Pick<NewItem<SubscriptionPurchase>, "plan" | "paymentProvider"> & {
	startDay: Day
}): SubscriptionPurchase {
	const startDate = dayToDate(startDay)
	const endDate = getDate(startDate).plusOne.year
	const endDay = dateToDay(endDate)
	const dayInterval = { start: startDay, end: endDay }
	return {
		id: newId(),
		paymentProvider,
		plan,
		...createdNow(),
		...dayInterval
	}
}

export function isYearlyPurchase({
	numMonths
}: {
	numMonths: unknown
}): boolean | undefined {
	if (typeof numMonths !== "number") return
	return numMonths === purchaseMaxNumMonths
}
