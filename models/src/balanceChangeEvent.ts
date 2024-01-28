import { Balance } from "./balance.js"
import { CreationTime } from "./time.js"

export type BalanceChangeEvent = CreationTime & {
	balances: Balance[]
}
