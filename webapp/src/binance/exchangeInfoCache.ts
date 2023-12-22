import { binanceDB } from "_/storages/binanceDB"
import {
	BinanceExchangeInfo,
	BinanceExchangeInfoCacheProvider
} from "@workspace/binance"
import { CacheMap } from "@workspace/cache"

export class BinanceExchangeInfoCache
	implements BinanceExchangeInfoCacheProvider
{
	private readonly isValidSymbolMap = new CacheMap<boolean>()

	getExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		return binanceDB.readExchangeInfo()
	}

	setExchangeInfo(arg: BinanceExchangeInfo): Promise<void> {
		return binanceDB.writeExchangeInfo(arg)
	}

	getIsValidSymbol(symbol: string) {
		return Promise.resolve(this.isValidSymbolMap.get(symbol))
	}

	setIsValidSymbol(symbol: string, value: boolean) {
		return Promise.resolve(this.isValidSymbolMap.set(symbol, value))
	}
}

export const binanceExchangeInfoCache = new BinanceExchangeInfoCache()
