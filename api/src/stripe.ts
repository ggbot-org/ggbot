import { AccountKey, isNaturalNumber, isSubscriptionPlan, NaturalNumber, Subscription } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { ActionTypes } from "./action.js"

export type StripeMetadata = AccountKey & Pick<Subscription, "plan">

type StripeClientAction = {
	CreateCheckoutSession: (
		arg: {
			/** Used to prefill the email field on the checkout page. */
			email: string
			/** Number of months to subscribe. */
			numMonths: NaturalNumber
		} & Pick<StripeMetadata, "plan">
	) => Promise<{
		/** The webapp will redirect to this checkout session URL. */
		url: string
	}>
}

export type StripeClientActionType = keyof StripeClientAction

export type StripeClientActionInput = {
	CreateCheckoutSession: Parameters<StripeClientAction["CreateCheckoutSession"]>[0]
}

export type StripeClientActionOutput = {
	CreateCheckoutSession: Awaited<ReturnType<StripeClientAction["CreateCheckoutSession"]>>
}

export const stripeClientActions: ActionTypes<StripeClientActionType> = [
	"CreateCheckoutSession"
]

export const isStripeClientActionInput = {
	CreateCheckoutSession: objectTypeGuard<StripeClientActionInput["CreateCheckoutSession"]>(
		({ numMonths, plan }) => isNaturalNumber(numMonths) && isSubscriptionPlan(plan)
	)
}
