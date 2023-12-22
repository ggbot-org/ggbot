import { CacheMap } from "@workspace/cache"

import { BinanceKlinesCacheProvider } from "./cacheProviders.js"
import { BinanceKline, BinanceKlineInterval } from "./types.js"
import { binanceKlineKey } from "./utils.js"

const ONE_WEEK = 604_800_000

export class BinanceKlinesCacheMap implements BinanceKlinesCacheProvider {
	private readonly klinesMap = new CacheMap<BinanceKline>(ONE_WEEK)

	getKline(
		symbol: string,
		interval: BinanceKlineInterval,
		time: number
	): Promise<BinanceKline | undefined> {
		const key = binanceKlineKey(symbol, interval, time)
		const kline = this.klinesMap.get(key)
		return Promise.resolve(kline)
	}

	setKline(
		symbol: string,
		interval: BinanceKlineInterval,
		kline: BinanceKline
	): Promise<void> {
		const key = binanceKlineKey(symbol, interval, kline[0])
		this.klinesMap.set(key, kline)
		return Promise.resolve()
	}
}
