import { CacheMap } from "@ggbot2/cache"

import { BinanceKlineCacheProvider } from "./cacheProviders.js"
import { BinanceKline, BinanceKlineInterval } from "./types.js"

export class BinanceKlinesCacheMap implements BinanceKlineCacheProvider {
	private readonly klinesMap = new CacheMap<BinanceKline>("ONE_WEEK")

	getKline(
		symbol: string,
		interval: BinanceKlineInterval,
		time: number
	): BinanceKline | undefined {
		const key = this.klineKey(symbol, interval, time)
		const kline = this.klinesMap.get(key)
		return kline
	}

	setKline(
		symbol: string,
		interval: BinanceKlineInterval,
		kline: BinanceKline
	): void {
		const key = this.klineKey(symbol, interval, kline[0])
		this.klinesMap.set(key, kline)
	}

	private klineKey(
		symbol: string,
		interval: BinanceKlineInterval,
		/* THe kline open time. */
		time: number
	) {
		return [symbol, interval, time].join(":")
	}
}
