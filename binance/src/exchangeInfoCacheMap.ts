import { CacheMap } from "@workspace/cache"

import { BinanceExchangeInfoCacheProvider } from "./cacheProviders.js"
import { BinanceExchangeInfo } from "./types.js"

const cache = new CacheMap<BinanceExchangeInfo>(86_400_000) // 1 day

export class BinanceExchangeInfoCacheMap implements BinanceExchangeInfoCacheProvider {
	getExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		return Promise.resolve(cache.get("exchangeInfo"))
	}

	setExchangeInfo(value: BinanceExchangeInfo): Promise<void> {
		return Promise.resolve(cache.set("exchangeInfo", value))
	}
}
