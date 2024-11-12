import { BinanceBalance, BinanceKlineInterval } from './types.js'

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
export function balanceIsNotEmpty({ free, locked }: BinanceBalance): boolean {
	return Number(free) + Number(locked) > 0
}

export function binanceKlineKey(
	symbol: string,
	interval: BinanceKlineInterval,
	/* THe kline open time. */
	time: number
) {
	return [symbol, interval, time].join(':')
}
