import { isDay } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey, isAccountKey } from "./account.js"
import { Order } from "./order.js"
import { StrategyKey } from "./strategy.js"
import { DayKey } from "./time.js"

export type AccountDailyOrder = StrategyKey & { order: Order }

export type AccountDailyOrdersKey = AccountKey & DayKey

export const isAccountDailyOrdersKey = objectTypeGuard<AccountDailyOrdersKey>(
	({ day, ...key }) => isDay(day) && isAccountKey(key)
)
