import { BinanceExchangeInfo, BinanceSymbolInfo } from "@workspace/binance"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import {
	DflowBinanceKlineInterval,
	isDflowBinanceKlineInterval
} from "./klineIntervals.js"

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
	({ baseAsset, isSpotTradingAllowed, quoteAsset, status, symbol }) =>
		isSpotTradingAllowed === true &&
		status === "TRADING" &&
		typeof symbol === "string" &&
		typeof baseAsset === "string" &&
		typeof quoteAsset === "string" &&
		symbol === `${baseAsset}${quoteAsset}`
)

export const binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols = (
	symbols: BinanceExchangeInfo["symbols"]
): DflowBinanceSymbolInfo[] =>
	symbols
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

export const dflowBinanceSymbolSeparator = "/"

export const getDflowBinanceNodeSymbolKind = ({
	baseAsset,
	quoteAsset
}: Pick<BinanceSymbolInfo, "baseAsset" | "quoteAsset">) =>
	[baseAsset, quoteAsset].join(dflowBinanceSymbolSeparator)

export type DflowBinanceSymbolAndInterval = {
	symbol: string
	interval: DflowBinanceKlineInterval
}

export const isDflowBinanceSymbolAndInterval =
	objectTypeGuard<DflowBinanceSymbolAndInterval>(({ symbol, interval }) => {
		if (typeof symbol !== "string") return false
		if (!isDflowBinanceKlineInterval(interval)) return false
		return true
	})
