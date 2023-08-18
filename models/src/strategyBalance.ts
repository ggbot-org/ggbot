import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils"
import { Day, DayInterval, isDay, isDayInterval } from "minimal-time-helpers"

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import {
	BalanceChangeEvent,
	isBalanceChangeEvents
} from "./balanceChangeEvent.js"

export type StrategyBalance = { day: Day; data: BalanceChangeEvent[] }

export const isStrategyBalance = objectTypeGuard<StrategyBalance>(
	({ day, data }) => isDay(day) && isBalanceChangeEvents(data)
)

export type StrategyBalances = StrategyBalance[]

export const isStrategyBalances =
	arrayTypeGuard<StrategyBalance>(isStrategyBalance)

export type ReadStrategyBalancesInput = AccountStrategyKey & DayInterval

export const isReadStrategyBalancesInput =
	objectTypeGuard<ReadStrategyBalancesInput>(
		({ start, end, ...accountStrategyKey }) =>
			isDayInterval({ start, end }) &&
			isAccountStrategyKey(accountStrategyKey)
	)

export type ReadStrategyBalances = (
	arg: ReadStrategyBalancesInput
) => Promise<StrategyBalances>
