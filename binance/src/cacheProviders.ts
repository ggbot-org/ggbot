import { BinanceExchangeInfo, BinanceKline, BinanceKlineInterval } from "./types.js"

export type BinanceExchangeInfoCacheProvider = {
	getExchangeInfo(): Promise<BinanceExchangeInfo | undefined>
	setExchangeInfo(value: BinanceExchangeInfo): Promise<void>
}

export type BinanceKlinesCacheProvider = {
	getKline(
		symbol: string,
		interval: BinanceKlineInterval,
		time: number
	): Promise<BinanceKline | undefined>
	setKline(
		symbol: string,
		interval: BinanceKlineInterval,
		kline: BinanceKline
	): Promise<void>
}
