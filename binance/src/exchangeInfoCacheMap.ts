import { CacheMap } from "@workspace/cache"

import { BinanceExchangeInfoCacheProvider } from "./cacheProviders.js"
import { BinanceExchangeInfo } from "./types.js"

const ONE_DAY = 86_400_000

export class BinanceExchangeInfoCacheMap
	implements BinanceExchangeInfoCacheProvider
{
	private readonly exchangeInfoKey = "exchangeInfo"

	private readonly exchangeInfoMap = new CacheMap<BinanceExchangeInfo>(
		ONE_DAY
	)

	getExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		return Promise.resolve(this.exchangeInfoMap.get(this.exchangeInfoKey))
	}

	setExchangeInfo(value: BinanceExchangeInfo): Promise<void> {
		return Promise.resolve(
			this.exchangeInfoMap.set(this.exchangeInfoKey, value)
		)
	}
}
