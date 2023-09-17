import { isLiteralType } from "minimal-type-guard-helpers"

/**
 * Binance kline intervals supported by ggbot2 dflow implementation.
 *
 * Note that the items are in ascending cronological order, so they can be used
 * to sort by intervals.
 *
 * @example
 *
 * ```ts
 * const values = [{ interval: "1d" }, { interval: "1h" }]
 * const sortedValues = values.toSorted(
 * 	(a, b) =>
 * 		dflowBinanceKlineIntervals.indexOf(a.interval) -
 * 		dflowBinanceKlineIntervals.indexOf(b.interval)
 * )
 * console.info(sortedValues) // [ { interval: '1h' }, { interval: '1d' } ];
 * ```
 */
export const dflowBinanceKlineIntervals = [
	"5m",
	"15m",
	"30m",
	"1h",
	"2h",
	"4h",
	"6h",
	"8h",
	"12h",
	"1d",
	"3d",
	"1w",
	"1M"
] as const

export type DflowBinanceKlineInterval =
	(typeof dflowBinanceKlineIntervals)[number]

export const isDflowBinanceKlineInterval =
	isLiteralType<DflowBinanceKlineInterval>(dflowBinanceKlineIntervals)

export const dflowBinanceLowerKlineInterval: DflowBinanceKlineInterval =
	dflowBinanceKlineIntervals[0]
