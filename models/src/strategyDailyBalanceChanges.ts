import { isDay } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { BalanceChangeEvents } from "./balanceChangeEvent.js"
import { DayKey, UpdateTime } from "./time.js"

/** Daily balance changes per strategy. */
export type StrategyDailyBalanceChangesKey = AccountStrategyKey & DayKey

export const isStrategyDailyBalanceChangesKey =
	objectTypeGuard<StrategyDailyBalanceChangesKey>(
		({ day, ...key }) => isDay(day) && isAccountStrategyKey(key)
	)

export type ReadStrategyDailyBalanceChanges = (
	arg: StrategyDailyBalanceChangesKey
) => Promise<BalanceChangeEvents>

type AppendStrategyDailyBalanceChangesInput = StrategyDailyBalanceChangesKey & {
	items: BalanceChangeEvents
}

export type AppendStrategyDailyBalanceChanges = (
	arg: AppendStrategyDailyBalanceChangesInput
) => Promise<UpdateTime>
