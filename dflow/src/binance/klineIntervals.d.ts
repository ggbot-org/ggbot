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
 * const sortedValues = values.slice().sort((a, b) =>
 *   dflowBinanceKlineIntervals.indexOf(a.interval) - dflowBinanceKlineIntervals.indexOf(b.interval)
 * )
 * console.info(sortedValues) // [ { interval: '1h' }, { interval: '1d' } ]
 * ```
 */
export declare const dflowBinanceKlineIntervals: readonly ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d']

export type DflowBinanceKlineInterval = (typeof dflowBinanceKlineIntervals)[number]

export declare function isDflowBinanceKlineInterval(arg: unknown): arg is DflowBinanceKlineInterval
