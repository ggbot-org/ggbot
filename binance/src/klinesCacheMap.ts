import { CacheMap } from '@workspace/cache'

import { BinanceKlinesCacheProvider } from './cacheProviders.js'
import { BinanceKline, BinanceKlineInterval } from './types.js'
import { binanceKlineKey } from './utils.js'

export class BinanceKlinesCacheMap implements BinanceKlinesCacheProvider {
	readonly klinesMap: CacheMap<BinanceKline>

	constructor(timeToLive?: CacheMap<BinanceKline>['timeToLive']) {
		this.klinesMap = new CacheMap<BinanceKline>(timeToLive)
	}

	getKline(symbol: string, interval: BinanceKlineInterval, time: number): Promise<BinanceKline | undefined> {
		const key = binanceKlineKey(symbol, interval, time)
		const kline = this.klinesMap.get(key)
		return Promise.resolve(kline)
	}

	setKline(symbol: string, interval: BinanceKlineInterval, kline: BinanceKline): Promise<void> {
		const key = binanceKlineKey(symbol, interval, kline[0])
		this.klinesMap.set(key, kline)
		return Promise.resolve()
	}
}
