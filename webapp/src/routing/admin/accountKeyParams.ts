import { AccountKey, isAccountKey } from "@workspace/models"

const accountIdKey = "accountId"

export const accountKeyParamsFromCurrentLocation = ():
	| AccountKey
	| undefined => {
	const url = new URL(window.location.toString())

	const accountKey = {
		accountId: url.searchParams.get(accountIdKey)
	}

	if (isAccountKey(accountKey)) return accountKey
}
