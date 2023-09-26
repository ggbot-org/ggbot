import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"

import { Balance, isBalances } from "./balance.js"
import { CreationTime, isCreationTime } from "./time.js"

export type BalanceChangeEvent = CreationTime & {
	balances: Balance[]
}

const isBalanceChangeEvent = objectTypeGuard<BalanceChangeEvent>(
	({ balances, ...creationTime }) =>
		isCreationTime(creationTime) && isBalances(balances)
)

export type BalanceChangeEvents = BalanceChangeEvent[]

export const isBalanceChangeEvents =
	arrayTypeGuard<BalanceChangeEvent>(isBalanceChangeEvent)
