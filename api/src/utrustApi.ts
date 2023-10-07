import {
	AllowedCountryIsoCode2,
	EmailAddress,
	isAllowedCountryIsoCode2,
	isEmailAddress,
	isNaturalNumber,
	isSubscriptionPlan,
	NaturalNumber,
	SubscriptionPlan
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

export type UtrustApiCallabackRequestData = {
	ok: boolean
}

export type UtrustApiOrderRequestData = {
	country: AllowedCountryIsoCode2
	email: EmailAddress
	itemName: string
	numMonths: NaturalNumber
	plan: SubscriptionPlan
}

export const isUtrustApiOrderRequestData =
	objectTypeGuard<UtrustApiOrderRequestData>(
		({ country, email, itemName, numMonths, plan }) =>
			isAllowedCountryIsoCode2(country) &&
			isEmailAddress(email) &&
			typeof itemName === "string" &&
			isNaturalNumber(numMonths) &&
			isSubscriptionPlan(plan)
	)

export type UtrustApiOrderResponseData = {
	redirectUrl: string
}

export const isUtrustApiOrderResponseData =
	objectTypeGuard<UtrustApiOrderResponseData>(
		({ redirectUrl }) => typeof redirectUrl === "string"
	)
