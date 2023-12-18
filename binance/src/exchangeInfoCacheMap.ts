import { CacheMap } from "@workspace/cache"

import { BinanceExchangeInfoCacheProvider } from "./cacheProviders.js"
import { BinanceExchangeInfo } from "./types.js"

// `isValidSymbolMap` and `exchangeInfoMap` are cached with same duration.
const ONE_DAY = 86_400_000
const exchangeInfoCacheDuration = ONE_DAY

export class BinanceExchangeInfoCacheMap
	implements BinanceExchangeInfoCacheProvider
{
	private readonly exchangeInfoKey = "exchangeInfo"

	private readonly exchangeInfoMap = new CacheMap<BinanceExchangeInfo>(
		exchangeInfoCacheDuration
	)

	private readonly isValidSymbolMap = new CacheMap<boolean>(
		exchangeInfoCacheDuration
	)

	getExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		return Promise.resolve(this.exchangeInfoMap.get(this.exchangeInfoKey))
	}

	setExchangeInfo(value: BinanceExchangeInfo): Promise<void> {
		return Promise.resolve(
			this.exchangeInfoMap.set(this.exchangeInfoKey, value)
		)
	}

	getIsValidSymbol(symbol: string): Promise<boolean | undefined> {
		return Promise.resolve(this.isValidSymbolMap.get(symbol))
	}

	setIsValidSymbol(symbol: string, value: boolean): Promise<void> {
		return Promise.resolve(this.isValidSymbolMap.set(symbol, value))
	}
}
