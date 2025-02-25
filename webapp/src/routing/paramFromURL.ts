import {
	AccountKey,
	isAccountKey,
	isStrategyKey,
	StrategyKey,
} from '@workspace/models'

export function accountKeyParamsFromURL(url: URL): AccountKey | undefined {
	const accountKey = {
		accountId: url.searchParams.get('accountId'),
	}
	if (isAccountKey(accountKey)) return accountKey
}

export function strategyKeyParamsFromURL(url: URL): StrategyKey | undefined {
	const strategyKey = {
		strategyId: url.searchParams.get('strategyId'),
		strategyKind: url.searchParams.get('strategyKind'),
	}
	if (isStrategyKey(strategyKey)) return strategyKey
}
