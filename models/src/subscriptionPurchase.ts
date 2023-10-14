// TODO remove dflow (also as a models dependency)
import { DflowObject } from "dflow"
import {
	dateToDay,
	Day,
	DayInterval,
	dayToDate,
	getDate,
	isDay,
	isDayInterval,
	today
} from "minimal-time-helpers"
import {
	isLiteralType,
	isMaybeObject,
	objectTypeGuard
} from "minimal-type-guard-helpers"

import { AccountKey } from "./account.js"
import { Currency } from "./currency.js"
import { isItemId, Item, newId, NewItem } from "./item.js"
import { NaturalNumber } from "./numbers.js"
import { isPaymentProvider, PaymentProvider } from "./paymentProviders.js"
import { isSubscriptionPlan, SubscriptionPlan } from "./subscription.js"
import {
	createdNow,
	CreationTime,
	DayKey,
	isCreationTime,
	UpdateTime
} from "./time.js"

export const monthlyPrice = 10
export const purchaseCurrency: Currency = "EUR"
export const purchaseDefaultNumMonths = 6
/**
 * Maximum number of purchase months.
 *
 * It is bounded in order to renew conditions periodically. For example the
 * purchase may be blocked if the user needs to update its API settings.
 */
export const purchaseMaxNumMonths = 12
/** Minimum number of purchase months. */
export const purchaseMinNumMonths = 1

const subscriptionPurchaseStatuses = [
	"completed",
	"canceled",
	"pending"
] as const
type SubscriptionPurchaseStatus = (typeof subscriptionPurchaseStatuses)[number]
const isSubscriptionPurchaseStatus = isLiteralType<SubscriptionPurchaseStatus>(
	subscriptionPurchaseStatuses
)

export type SubscriptionPurchase = Item &
	CreationTime &
	DayInterval & {
		info?: DflowObject
		plan: SubscriptionPlan
		paymentProvider: PaymentProvider
		status: SubscriptionPurchaseStatus
	}

export const isSubscriptionPurchase = objectTypeGuard<SubscriptionPurchase>(
	({
		id,
		plan,
		paymentProvider,
		status,
		whenCreated,
		info,
		...dayInterval
	}) =>
		isItemId(id) &&
		isSubscriptionPlan(plan) &&
		isPaymentProvider(paymentProvider) &&
		isCreationTime({ whenCreated }) &&
		isDayInterval(dayInterval) &&
		isSubscriptionPurchaseStatus(status) &&
		info === undefined
			? true
			: isMaybeObject(info)
)

export type SubscriptionPurchaseKey = AccountKey &
	DayKey & {
		purchaseId: SubscriptionPurchase["id"]
	}

export const isSubscriptionPurchaseKey =
	objectTypeGuard<SubscriptionPurchaseKey>(
		({ day, accountId, purchaseId }) =>
			isItemId(accountId) && isDay(day) && isItemId(purchaseId)
	)

export const newSubscriptionPurchaseKey = ({
	accountId,
	purchaseId
}: Omit<SubscriptionPurchaseKey, "day">): SubscriptionPurchaseKey => ({
	accountId,
	purchaseId,
	day: today()
})

type NewMonthlySubscriptionArg = Pick<
	NewItem<SubscriptionPurchase>,
	"plan" | "paymentProvider"
> & {
	startDay: Day
	numMonths: NaturalNumber
}

export const newMonthlySubscription = ({
	plan,
	paymentProvider,
	startDay,
	numMonths
}: NewMonthlySubscriptionArg): SubscriptionPurchase => {
	const startDate = dayToDate(startDay)
	const endDate = getDate(startDate).plus(numMonths).months
	const endDay = dateToDay(endDate)
	const dayInterval = { start: startDay, end: endDay }
	return {
		id: newId(),
		paymentProvider,
		plan,
		status: "pending",
		...createdNow(),
		...dayInterval
	}
}

type NewYearlySubscriptionArg = Pick<
	NewItem<SubscriptionPurchase>,
	"plan" | "paymentProvider"
> & { startDay: Day }

export const newYearlySubscription = ({
	plan,
	paymentProvider,
	startDay
}: NewYearlySubscriptionArg): SubscriptionPurchase => {
	const startDate = dayToDate(startDay)
	const endDate = getDate(startDate).plusOne.year
	const endDay = dateToDay(endDate)
	const dayInterval = { start: startDay, end: endDay }
	return {
		id: newId(),
		paymentProvider,
		plan,
		status: "pending",
		...createdNow(),
		...dayInterval
	}
}

export const totalPurchase = (numMonths: NaturalNumber) => {
	// if 12 months, apply discount.
	if (numMonths === 12) return monthlyPrice * 11
	return numMonths * monthlyPrice
}

export type ReadSubscriptionPurchase = (
	arg: SubscriptionPurchaseKey
) => Promise<SubscriptionPurchase | null>

type WriteSubscriptionPurchaseInput = SubscriptionPurchaseKey &
	SubscriptionPurchase

export type WriteSubscriptionPurchase = (
	arg: WriteSubscriptionPurchaseInput
) => Promise<UpdateTime>

type CreateYearlySubscriptionPurchaseInput = AccountKey &
	NewYearlySubscriptionArg

/** Create a yearly subscription. */
export type CreateYearlySubscriptionPurchase = (
	arg: CreateYearlySubscriptionPurchaseInput
) => Promise<SubscriptionPurchaseKey>

type CreateMonthlySubscriptionPurchaseInput = AccountKey &
	NewMonthlySubscriptionArg

/** Create a monthly subscription. */
export type CreateMonthlySubscriptionPurchase = (
	arg: CreateMonthlySubscriptionPurchaseInput
) => Promise<SubscriptionPurchaseKey>

type UpdateSubscriptionPurchaseInfoInput = SubscriptionPurchaseKey &
	Pick<SubscriptionPurchase, "info">

export type UpdateSubscriptionPurchaseInfo = (
	arg: UpdateSubscriptionPurchaseInfoInput
) => Promise<UpdateTime>

type UpdateSubscriptionPurchaseStatusInput = SubscriptionPurchaseKey &
	Pick<SubscriptionPurchase, "status">

export type UpdateSubscriptionPurchaseStatus = (
	arg: UpdateSubscriptionPurchaseStatusInput
) => Promise<UpdateTime>
