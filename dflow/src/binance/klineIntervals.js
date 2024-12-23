import { isLiteralType } from 'minimal-type-guard-helpers'

// Order matters, intervals must be sorted by their duration.
export const dflowBinanceKlineIntervals = [
	'1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'
]

export const isDflowBinanceKlineInterval = isLiteralType(dflowBinanceKlineIntervals)
