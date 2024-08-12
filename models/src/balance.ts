import { StrategyKey } from "./strategy.js"
import { NonEmptyString } from "./strings.js"
import { CreationTime } from "./time.js"

/** A BalanceItem represents an asset inflow or outflow. */
export type BalanceItem = {
	/** Asset symbol, e.g. BTC, ETH. */
	asset: NonEmptyString
	/** Free value available. */
	free: NonEmptyString
	/** Locked value, for example via staking or a limit order. */
	locked: NonEmptyString
}

/**
 * A Balance is an array of BalanceItem.
 *
 * @remarks
 * Values can be negative, for example a simulation could start with an empty
 * list of balances.
 * @example
 *
 * ```typescript
 * const balance: Balance = []
 * ```
 *
 * Then after buying BTC for a worth of 1000 USD we have the following balances.
 *
 * @example
 *
 * ```json
 * [
 *   {
 *     "asset": "BTC",
 *     "free": "0.01000000",
 *     "locked": "0"
 *   },
 *   {
 *     "asset": "USD",
 *     "free": "-1000.00",
 *     "locked": "0"
 *   }
 * ]
 * ```
 */
export type Balance = BalanceItem[]

/**
 * A BalanceEvent happens when a strategy perform an operation that modifies an account balance.
 */
export type BalanceEvent = StrategyKey & CreationTime & {
	balance: Balance
}
