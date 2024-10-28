import { BinanceExchangeInfo, BinanceSymbolInfo } from "@workspace/binance"

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
	| "status"
	| "symbol"
>

export function binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(
	symbols: BinanceExchangeInfo["symbols"]
): DflowBinanceSymbolInfo[] {
	return symbols
		.filter(({ isSpotTradingAllowed }) => isSpotTradingAllowed)
		.map(
			({
				baseAsset,
				baseAssetPrecision,
				baseCommissionPrecision,
				filters,
				isSpotTradingAllowed,
				quoteAsset,
				quoteAssetPrecision,
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
				status,
				symbol,
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
