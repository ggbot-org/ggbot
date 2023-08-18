import {
	BinanceExchangeInfo,
	BinanceKline,
	BinanceKlineInterval
} from "./types.js"

export type BinanceExchangeInfoCacheProvider = {
	getExchangeInfo(): BinanceExchangeInfo | undefined
	setExchangeInfo(arg: BinanceExchangeInfo): void
	getIsValidSymbol(symbol: string): boolean | undefined
	setIsValidSymbol(symbol: string, value: boolean): void
}

export type BinanceKlineCacheProvider = {
	getKline(
		symbol: string,
		interval: BinanceKlineInterval,
		time: number
	): BinanceKline | undefined
	setKline(
		symbol: string,
		interval: BinanceKlineInterval,
		kline: BinanceKline
	): void
}
