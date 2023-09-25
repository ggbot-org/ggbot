import {
	AccountKey,
	AllowedCountryIsoCode2,
	EmailAddress,
	isAccountKey,
	isAllowedCountryIsoCode2,
	isEmailAddress,
	isNaturalNumber,
	NaturalNumber
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

export type ApiUtrustCallabackRequestData = {
	ok: boolean
}

type ApiUtrustOrderRequestData = AccountKey & {
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
