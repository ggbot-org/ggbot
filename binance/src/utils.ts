import { BinanceBalance } from "./types.js"

/**
 * Check if a balance is not empty.
 *
 * An empty balance looks like this.
 *
 * @example
 *
 * ```json
 * { "asset": "LUNA", "free": "0.00000000", "locked": "0.00000000" }
 * ```
 */
export const balanceIsNotEmpty = ({ free, locked }: BinanceBalance) =>
	Number(free) + Number(locked) > 0
