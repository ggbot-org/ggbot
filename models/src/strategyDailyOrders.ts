import { AccountStrategyKey } from "./accountStrategy.js"
import { Order } from "./order.js"
import { DayKey, UpdateTime } from "./time.js"

export type StrategyDailyOrdersKey = AccountStrategyKey & DayKey

type AppendStrategyDailyOrdersInput = StrategyDailyOrdersKey & {
	items: Order[]
}

export type AppendStrategyDailyOrders = (
	arg: AppendStrategyDailyOrdersInput
) => Promise<UpdateTime>
