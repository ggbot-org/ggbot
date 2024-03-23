import { isNaturalNumber, NaturalNumber } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { ActionTypes } from "./action.js"

type StripeClientAction = {
	CreateCheckoutSession: (arg: {
		numMonths: NaturalNumber
	}) => Promise<{ url: string }>
}

type StripeClientActionType = keyof StripeClientAction

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
	>(({ numMonths }) => isNaturalNumber(numMonths))
}
