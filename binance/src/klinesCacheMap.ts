import { CacheMap } from "@ggbot2/cache"
import { Time } from "@ggbot2/time"

import { BinanceKlineCacheProvider } from "./cacheProviders.js"
import { BinanceKline, BinanceKlineInterval } from "./types.js"

export class BinanceKlinesCacheMap implements BinanceKlineCacheProvider {
	private klineKey(
		symbol: string,
		interval: BinanceKlineInterval,
		/* THe kline open time. */
		time: Time
	) {
		return [symbol, interval, time].join(":")
	}

	private readonly klinesMap = new CacheMap<BinanceKline>("ONE_WEEK")

	getKline(
		symbol: string,
		interval: BinanceKlineInterval,
		time: Time
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
}
