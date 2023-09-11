import {
	AccountKey,
	AllowedCountryIsoCode2,
	EmailAddress,
	isAccountKey,
	isAllowedCountryIsoCode2,
	isEmailAddress
} from "@workspace/models"
import {
	isNaturalNumber,
	NaturalNumber,
	objectTypeGuard
} from "@workspace/type-utils"

export type ApiUtrustCallabackRequestData = {
	ok: boolean
}

export type ApiUtrustOrderRequestData = AccountKey & {
	country: AllowedCountryIsoCode2
	email: EmailAddress
	numMonths: NaturalNumber
}

export const isApiUtrustOrderRequestData =
	objectTypeGuard<ApiUtrustOrderRequestData>(
		({ country, email, numMonths, ...accountKey }) =>
			isAllowedCountryIsoCode2(country) &&
			isEmailAddress(email) &&
			isNaturalNumber(numMonths) &&
			isAccountKey(accountKey)
	)

export type ApiUtrustOrderResponseData = {
	redirectUrl: string
}

export const isApiUtrustOrderResponseData =
	objectTypeGuard<ApiUtrustOrderResponseData>(
		({ redirectUrl }) => typeof redirectUrl === "string"
	)
