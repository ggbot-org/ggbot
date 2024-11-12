import { isDay } from 'minimal-time-helpers'
import { objectTypeGuard } from 'minimal-type-guard-helpers'

import { AccountKey, isAccountKey } from './account.js'
import { AccountStrategyKey } from './accountStrategy.js'
import { DayKey } from './time.js'

/** Used to aggregate daily data regarding an account. */
export type AccountDailyKey = AccountKey & DayKey

export const isAccountDailyKey = objectTypeGuard<AccountDailyKey>(
	({ day, ...key }) => isDay(day) && isAccountKey(key)
)

/** Used to aggregate daily data regarding a strategy run by an account. */
export type AccountStrategyDailyKey = AccountStrategyKey & DayKey
