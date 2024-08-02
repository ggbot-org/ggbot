import { BinanceExchangeInfo, BinanceSymbolInfo } from "@workspace/binance"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { DflowBinanceKlineInterval } from "./klineIntervals.js"

export type DflowBinanceSymbolInfo = Pick<
	BinanceSymbolInfo,
	| "baseAsset"
	| "baseAssetPrecision"
	| "baseCommissionPrecision"
	| "filters"
	| "isSpotTradingAllowed"
	| "quoteAsset"
	| "quoteAssetPrecision"
	| "quotePrecision"
	| "status"
	| "symbol"
>

export const isDflowBinanceSymbolInfo = objectTypeGuard<DflowBinanceSymbolInfo>(
	({ baseAsset, isSpotTradingAllowed, quoteAsset, status, symbol }) => isSpotTradingAllowed === true &&
		status === "TRADING" &&
		typeof symbol === "string" &&
		typeof baseAsset === "string" &&
		typeof quoteAsset === "string" &&
		symbol === `${baseAsset}${quoteAsset}`
)

export function binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(
	symbols: BinanceExchangeInfo["symbols"]
): DflowBinanceSymbolInfo[] {
	return symbols
		.filter(isDflowBinanceSymbolInfo)
		.map(
			({
				baseAsset,
				baseAssetPrecision,
				baseCommissionPrecision,
				filters,
				isSpotTradingAllowed,
				quoteAsset,
				quoteAssetPrecision,
				quotePrecision,
				status,
				symbol
			}) => ({
				baseAsset,
				baseAssetPrecision,
				baseCommissionPrecision,
				filters,
				isSpotTradingAllowed,
				quoteAsset,
				quoteAssetPrecision,
				quotePrecision,
				status,
				symbol
			})
		)
}

export const dflowBinanceSymbolSeparator = "/"

export function getDflowBinanceNodeSymbolKind({
	baseAsset,
	quoteAsset
}: Pick<BinanceSymbolInfo, "baseAsset" | "quoteAsset">) {
	return [baseAsset, quoteAsset].join(dflowBinanceSymbolSeparator)
}

export type DflowBinanceSymbolAndInterval = {
	symbol: string
	interval: DflowBinanceKlineInterval
}
