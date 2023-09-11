import { sessionWebStorage } from "_/storages/session.js"
import {
	BinanceExchangeInfo,
	BinanceExchangeInfoCacheProvider
} from "@workspace/binance"
import { CacheMap } from "@workspace/cache"

class BinanceExchangeInfoCacheSessionWebStorage
	implements BinanceExchangeInfoCacheProvider
{
	readonly isValidSymbolMap = new CacheMap<boolean>()

	getExchangeInfo(): BinanceExchangeInfo | undefined {
		return sessionWebStorage.binanceExchangeInfo
	}

	setExchangeInfo(arg: BinanceExchangeInfo): void {
		sessionWebStorage.binanceExchangeInfo = arg
	}

	getIsValidSymbol(symbol: string) {
		return this.isValidSymbolMap.get(symbol)
	}

	setIsValidSymbol(symbol: string, value: boolean) {
		this.isValidSymbolMap.set(symbol, value)
	}
}

export const binanceExchangeInfoCacheSessionWebStorage =
	new BinanceExchangeInfoCacheSessionWebStorage()
