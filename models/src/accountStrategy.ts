import { objectTypeGuard } from 'minimal-type-guard-helpers'

import { AccountKey, isAccountKey } from './account.js'
import { ItemKey } from './item.js'
import { isName } from './name.js'
import { isStrategyKey, Strategy, StrategyKey } from './strategy.js'
import { isStrategySchedulings, StrategyScheduling } from './strategyScheduling.js'

export type AccountStrategyKey = AccountKey & StrategyKey

export const isAccountStrategyKey = objectTypeGuard<AccountStrategyKey>(
	({ accountId, ...strategyKey }) => isAccountKey({ accountId }) && isStrategyKey(strategyKey)
)

export type AccountStrategy = StrategyKey &
	Pick<Strategy, 'name'> & {
		schedulings: StrategyScheduling[]
	}

export const isAccountStrategy = objectTypeGuard<AccountStrategy>(
	({ name, schedulings, ...strategyKey }) => isStrategyKey(strategyKey) &&
		isName(name) &&
		isStrategySchedulings(schedulings)
)

export function newAccountStrategy({ name, ...strategyKey }: Pick<
	AccountStrategy, 'strategyId' | 'strategyKind' | 'name'
>): AccountStrategy {
	return { ...strategyKey, name, schedulings: [] }
}

export type AccountStrategySchedulingKey = Pick<AccountStrategyKey, 'accountId' | 'strategyId'> &
	ItemKey<'schedulingId', { schedulingId: StrategyScheduling['id'] }>
