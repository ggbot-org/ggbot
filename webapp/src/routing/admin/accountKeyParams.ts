import { AccountKey, isAccountKey } from "@ggbot2/models"

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

export const accountKeyToURLSearchParams = ({ accountId }: AccountKey) => {
	const params = new URLSearchParams()
	params.append(accountIdKey, accountId)
	return params
}
