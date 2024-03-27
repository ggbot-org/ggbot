import {
	AccountKey,
	isNaturalNumber,
	isSubscriptionPlan,
	NaturalNumber,
	Subscription,
	SubscriptionPlan
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { ActionTypes } from "./action.js"

export type StripeMetadata = AccountKey & Pick<Subscription, "plan">

type StripeClientAction = {
	CreateCheckoutSession: (arg: {
		/** Number of months to subscribe. */
		numMonths: NaturalNumber
		plan: SubscriptionPlan
	}) => Promise<{ url: string }>
}

export type StripeClientActionType = keyof StripeClientAction

export type StripeClientActionInput = {
	CreateCheckoutSession: Parameters<
		StripeClientAction["CreateCheckoutSession"]
	>[0]
}

export type StripeClientActionOutput = {
	CreateCheckoutSession: Awaited<
		ReturnType<StripeClientAction["CreateCheckoutSession"]>
	>
}

export const stripeClientActions: ActionTypes<StripeClientActionType> = [
	"CreateCheckoutSession"
]

export const isStripeClientActionInput = {
	CreateCheckoutSession: objectTypeGuard<
		StripeClientActionInput["CreateCheckoutSession"]
	>(
		({ numMonths, plan }) =>
			isNaturalNumber(numMonths) && isSubscriptionPlan(plan)
	)
}
