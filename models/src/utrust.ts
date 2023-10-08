import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey, isAccountKey } from "./account.js"
import { AllowedCountryIsoCode2, isAllowedCountryIsoCode2 } from "./country.js"
import { EmailAddress, isEmailAddress } from "./email.js"
import { isNaturalNumber, NaturalNumber } from "./numbers.js"
import { isSubscriptionPlan, SubscriptionPlan } from "./subscription.js"

type CreateUtrustOrderInput = AccountKey & {
	country: AllowedCountryIsoCode2
	email: EmailAddress
	itemName: string
	numMonths: NaturalNumber
	plan: SubscriptionPlan
}

export const isCreateUtrustOrderInput = objectTypeGuard<CreateUtrustOrderInput>(
	({ country, email, itemName, numMonths, plan, ...accountKey }) =>
		isAccountKey(accountKey) &&
		isAllowedCountryIsoCode2(country) &&
		isEmailAddress(email) &&
		typeof itemName === "string" &&
		isNaturalNumber(numMonths) &&
		isSubscriptionPlan(plan)
)

type CreateUtrustOrderOutput = {
	redirectUrl: string
}

export type CreateUtrustOrder = (
	arg: CreateUtrustOrderInput
) => Promise<CreateUtrustOrderOutput | null>
