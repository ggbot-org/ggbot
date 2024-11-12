import { accountKeyParamsFromURL } from '_/routing/paramFromURL'

export function useAccountKey() {
	return {
		accountKey: accountKeyParamsFromURL(new URL(location.href))
	}
}
