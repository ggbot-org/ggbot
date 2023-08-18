import { objectTypeGuard } from "@ggbot2/type-utils"
import { DayInterval, isDayInterval } from "minimal-time-helpers"

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { StrategyDailyOrders } from "./strategyDailyOrders.js"

export type ReadStrategyOrdersInput = AccountStrategyKey & DayInterval

export const isReadStrategyOrdersInput =
	objectTypeGuard<ReadStrategyOrdersInput>(
		({ start, end, ...accountStrategyKey }) =>
			isDayInterval({ start, end }) &&
			isAccountStrategyKey(accountStrategyKey)
	)

export type ReadStrategyOrders = (
	arg: ReadStrategyOrdersInput
) => Promise<StrategyDailyOrders>
