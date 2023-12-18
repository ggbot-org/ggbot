import {
	BinanceExchangeInfo,
	BinanceKline,
	BinanceKlineInterval
} from "./types.js"

export type BinanceExchangeInfoCacheProvider = {
	getExchangeInfo(): Promise<BinanceExchangeInfo | undefined>
	setExchangeInfo(value: BinanceExchangeInfo): Promise<void>
	getIsValidSymbol(symbol: string): Promise<boolean | undefined>
	setIsValidSymbol(symbol: string, value: boolean): Promise<void>
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
