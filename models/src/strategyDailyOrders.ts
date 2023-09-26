import { arrayTypeGuard } from "minimal-type-guard-helpers"

import { AccountStrategyKey } from "./accountStrategy.js"
import { isOrder, Order } from "./order.js"
import { DayKey, UpdateTime } from "./time.js"

export type StrategyDailyOrder = Order
const isStrategyDailyOrder = (arg: unknown): arg is StrategyDailyOrder =>
	isOrder(arg)

export const isStrategyDailyOrders =
	arrayTypeGuard<StrategyDailyOrder>(isStrategyDailyOrder)

export type StrategyDailyOrdersKey = AccountStrategyKey & DayKey

export type ReadStrategyDailyOrders = (
	arg: StrategyDailyOrdersKey
) => Promise<StrategyDailyOrder[]>

type AppendStrategyDailyOrdersInput = StrategyDailyOrdersKey & {
	items: StrategyDailyOrder[]
}

export type AppendStrategyDailyOrders = (
	arg: AppendStrategyDailyOrdersInput
) => Promise<UpdateTime>
