import { AccountStrategyKey } from "./accountStrategy.js"
import { Order } from "./order.js"
import { DayKey, UpdateTime } from "./time.js"

export type StrategyDailyOrder = Order

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
