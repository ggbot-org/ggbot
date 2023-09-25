import { isDay } from "minimal-time-helpers"
import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountKey, isAccountKey } from "./account.js"
import { isOrder, Order } from "./order.js"
import { isStrategyKey, StrategyKey } from "./strategy.js"
import { DayKey, UpdateTime } from "./time.js"

type AccountDailyOrder = StrategyKey & { order: Order }
export const isAccountDailyOrder = objectTypeGuard<AccountDailyOrder>(
	({ order, ...strategyKey }) => isOrder(order) && isStrategyKey(strategyKey)
)

export const isAccountDailyOrders =
	arrayTypeGuard<AccountDailyOrder>(isAccountDailyOrder)

export type AccountDailyOrdersKey = AccountKey & DayKey

export const isAccountDailyOrdersKey = objectTypeGuard<AccountDailyOrdersKey>(
	({ day, ...key }) => isDay(day) && isAccountKey(key)
)

export type ReadAccountDailyOrders = (
	arg: AccountDailyOrdersKey
) => Promise<AccountDailyOrder[]>

type AppendAccountDailyOrdersInput = AccountDailyOrdersKey & {
	items: AccountDailyOrder[]
}

export type AppendAccountDailyOrders = (
	arg: AppendAccountDailyOrdersInput
) => Promise<UpdateTime>
