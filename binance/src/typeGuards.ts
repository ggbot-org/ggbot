import { isLiteralType } from "minimal-type-guard-helpers"

import {
	binanceKlineIntervals,
	binanceKlineMaxLimit,
	binanceOrderSides,
	binanceOrderTypes
} from "./constants.js"
import {
	BinanceExchangeInfo,
	BinanceFill,
	BinanceKline,
	BinanceKlineInterval,
	BinanceKlineOptionalParameters,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceSymbolFilterLotSize,
	BinanceSymbolFilterMinNotional
} from "./types.js"

// TODO use objectTypeGuard for all type guards

const isStringyNumber = (arg: unknown): boolean =>
	typeof arg === "string" && !isNaN(Number(arg))

export const isBinanceExchangeInfo = (
	arg: unknown
): arg is BinanceExchangeInfo => {
	if (typeof arg !== "object" || arg === null) return false
	const { timezone, serverTime, symbols, rateLimits } =
		arg as Partial<BinanceExchangeInfo>
	if (typeof timezone !== "string") return false
	if (typeof serverTime !== "number") return false
	// TODO better check for
	// symbols: BinanceSymbolInfo[];
	// rateLimits: BinanceRateLimitInfo[];
	if (!Array.isArray(symbols)) return false
	if (!Array.isArray(rateLimits)) return false
	return true
}

const isBinanceFill = (arg: unknown): arg is BinanceFill => {
	if (typeof arg !== "object" || arg === null) return false
	const { price, qty, commission, commissionAsset } =
		arg as Partial<BinanceFill>
	return (
		isStringyNumber(price) &&
		isStringyNumber(qty) &&
		isStringyNumber(commission) &&
		typeof commissionAsset === "string"
	)
}

export const isBinanceKline = (arg: unknown): arg is BinanceKline => {
	if (!Array.isArray(arg)) return false
	const [
		openTime,
		open,
		high,
		low,
		close,
		volume,
		closeTime,
		quoteVolume,
		numTrades,
		takerBaseVolume,
		takerQuoteVolume,
		_unusedField
	] = arg

	return (
		typeof openTime === "number" &&
		isStringyNumber(open) &&
		isStringyNumber(high) &&
		isStringyNumber(low) &&
		isStringyNumber(close) &&
		isStringyNumber(volume) &&
		typeof closeTime === "number" &&
		isStringyNumber(quoteVolume) &&
		typeof numTrades === "number" &&
		isStringyNumber(takerBaseVolume) &&
		isStringyNumber(takerQuoteVolume)
	)
}

export const isBinanceOrderRespFULL = (
	arg: unknown
): arg is BinanceOrderRespFULL => {
	if (typeof arg !== "object" || arg === null) return false
	const { fills } = arg as Partial<BinanceOrderRespFULL>
	if (!Array.isArray(fills)) return false
	return fills.every((fill) => isBinanceFill(fill))
}

export const isBinanceOrderType =
	isLiteralType<BinanceOrderType>(binanceOrderTypes)

export const isBinanceOrderSide =
	isLiteralType<BinanceOrderSide>(binanceOrderSides)

export const isBinanceSymbolFilterLotSize = (
	arg: unknown
): arg is BinanceSymbolFilterLotSize => {
	if (typeof arg !== "object" || arg === null) return false
	const { filterType, minQty, maxQty, stepSize } =
		arg as Partial<BinanceSymbolFilterLotSize>
	return (
		filterType === "LOT_SIZE" &&
		isStringyNumber(minQty) &&
		isStringyNumber(maxQty) &&
		isStringyNumber(stepSize)
	)
}

export const isBinanceSymbolFilterMinNotional = (
	arg: unknown
): arg is BinanceSymbolFilterMinNotional => {
	if (typeof arg !== "object" || arg === null) return false
	const { filterType, minNotional, applyToMarket, avgPriceMins } =
		arg as Partial<BinanceSymbolFilterMinNotional>
	return (
		filterType === "MIN_NOTIONAL" &&
		isStringyNumber(minNotional) &&
		typeof applyToMarket === "boolean" &&
		typeof avgPriceMins === "number"
	)
}

export const isBinanceKlineInterval = isLiteralType<BinanceKlineInterval>(
	binanceKlineIntervals
)

export const isBinanceKlineOptionalParameters = (
	arg: unknown
): arg is BinanceKlineOptionalParameters => {
	if (typeof arg !== "object" || arg === null) return false
	const { startTime, endTime, limit } =
		arg as Partial<BinanceKlineOptionalParameters>
	const startTimeIsNum = typeof startTime === "number"
	const endTimeIsNum = typeof endTime === "number"
	const limitIsNum = typeof limit === "number"
	// All parameters are optional.
	if ([startTime, endTime, limit].every((param) => param === undefined))
		return true
	// If a parameter is defined it must be a number.
	if (startTime !== undefined && !startTimeIsNum) return false
	if (endTime !== undefined && !endTimeIsNum) return false
	if (limit !== undefined && !limitIsNum) return false
	// If a parameter is number, it must be positive.
	if (startTimeIsNum && startTime < 0) return false
	if (endTimeIsNum && endTime < 0) return false
	if (limitIsNum && limit < 0) return false
	// `startTime` must preceed `endTime`.
	if (startTimeIsNum && endTimeIsNum) if (startTime > endTime) return false
	if (startTimeIsNum && endTimeIsNum) return true
	// `limit` is below its threeshold.
	if (limitIsNum && limit > binanceKlineMaxLimit) return false
	// TODO also need to check that `startTime` and `endTime` duration is below
	// limit threeshold? If yes, will need the interval as param.
	return true
}
