import { Day, DayInterval, isDayInterval } from "minimal-time-helpers"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { AccountStrategyKey, isAccountStrategyKey } from "./accountStrategy.js"
import { BalanceChangeEvent } from "./balanceChangeEvent.js"

type StrategyBalance = { day: Day; data: BalanceChangeEvent[] }

type ReadStrategyBalancesInput = AccountStrategyKey & DayInterval

export const isReadStrategyBalancesInput =
	objectTypeGuard<ReadStrategyBalancesInput>(
		({ start, end, ...accountStrategyKey }) =>
			isDayInterval({ start, end }) &&
			isAccountStrategyKey(accountStrategyKey)
	)

export type ReadStrategyBalances = (
	arg: ReadStrategyBalancesInput
) => Promise<StrategyBalance[]>
