import { arrayTypeGuard } from "minimal-type-guard-helpers"

import { AccountStrategyKey } from "./accountStrategy.js"
import { isOrder, Order } from "./order.js"
import { DayKey, UpdateTime } from "./time.js"

export type StrategyDailyOrder = Order
const isStrategyDailyOrder = (arg: unknown): arg is StrategyDailyOrder =>
	isOrder(arg)

/** Daily orders per strategy. */
export type StrategyDailyOrders = Order[]
export const isStrategyDailyOrders =
	arrayTypeGuard<StrategyDailyOrder>(isStrategyDailyOrder)

export type StrategyDailyOrdersKey = AccountStrategyKey & DayKey

export type ReadStrategyDailyOrders = (
	arg: StrategyDailyOrdersKey
) => Promise<StrategyDailyOrders>

type AppendStrategyDailyOrdersInput = StrategyDailyOrdersKey & {
	items: StrategyDailyOrders
}

export type AppendStrategyDailyOrders = (
	arg: AppendStrategyDailyOrdersInput
) => Promise<UpdateTime>
