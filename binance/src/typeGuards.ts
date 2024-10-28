import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

import { binanceKlineIntervals } from "./constants.js"
import { BinanceDecimal, BinanceErrorPayload, BinanceFill, BinanceKline, BinanceKlineInterval, BinanceSymbolFilterLotSize, BinanceSymbolFilterMinNotional } from "./types.js"

function isBinanceDecimal(arg: unknown): arg is BinanceDecimal {
	return typeof arg === "string" && !isNaN(Number(arg))
}

export const isBinanceErrorPayload = objectTypeGuard<BinanceErrorPayload>(
	({ code, msg }) => typeof code === "number" && typeof msg === "string"
)

export const isBinanceFill = objectTypeGuard<BinanceFill>(
	({ price, qty, commission, commissionAsset }) => isBinanceDecimal(price) &&
		isBinanceDecimal(qty) &&
		isBinanceDecimal(commission) &&
		typeof commissionAsset === "string"
)

export function isBinanceKline(arg: unknown): arg is BinanceKline {
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
		isBinanceDecimal(open) &&
		isBinanceDecimal(high) &&
		isBinanceDecimal(low) &&
		isBinanceDecimal(close) &&
		isBinanceDecimal(volume) &&
		typeof closeTime === "number" &&
		isBinanceDecimal(quoteVolume) &&
		typeof numTrades === "number" &&
		isBinanceDecimal(takerBaseVolume) &&
		isBinanceDecimal(takerQuoteVolume)
	)
}

export const isBinanceSymbolFilterLotSize = objectTypeGuard<BinanceSymbolFilterLotSize>(
	({ filterType, minQty, maxQty, stepSize }) => filterType === "LOT_SIZE" &&
		isBinanceDecimal(minQty) &&
		isBinanceDecimal(maxQty) &&
		isBinanceDecimal(stepSize)
)

export const isBinanceSymbolFilterMinNotional = objectTypeGuard<BinanceSymbolFilterMinNotional>(
	({ filterType, minNotional, applyToMarket, avgPriceMins }) => filterType === "MIN_NOTIONAL" &&
		isBinanceDecimal(minNotional) &&
		typeof applyToMarket === "boolean" &&
		typeof avgPriceMins === "number"
)

export const isBinanceKlineInterval = isLiteralType<BinanceKlineInterval>(binanceKlineIntervals)
