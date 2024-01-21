import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { binanceKlineIntervals } from "./constants.js"
import {
	BinanceErrorPayload,
	BinanceFill,
	BinanceKline,
	BinanceKlineInterval,
	BinanceOrderRespFULL,
	BinanceSymbolFilterLotSize,
	BinanceSymbolFilterMinNotional
} from "./types.js"

// TODO use objectTypeGuard for all type guards

const isStringyNumber = (arg: unknown): boolean =>
	typeof arg === "string" && !isNaN(Number(arg))

export const isBinanceErrorPayload = objectTypeGuard<BinanceErrorPayload>(
	({ code, msg }) => typeof code === "number" && typeof msg === "string"
)

export const isBinanceFill = (arg: unknown): arg is BinanceFill => {
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
	] = arg as unknown[]

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
