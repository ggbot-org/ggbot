import { binanceDB } from "_/storages/binanceDB"
import {
	BinanceExchangeInfo,
	BinanceExchangeInfoCacheProvider
} from "@workspace/binance"
import { CacheMap } from "@workspace/cache"

const ONE_DAY = 86_400_000

export class BinanceExchangeInfoCache
	implements BinanceExchangeInfoCacheProvider
{
	private readonly isValidSymbolMap = new CacheMap<boolean>()

	async getExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		const exchangeInfo = await binanceDB.readExchangeInfo()
		if (!exchangeInfo) return
		// Check `exchangeInfo` time to live and return data.
		if (Date.now() - exchangeInfo.serverTime < ONE_DAY) return exchangeInfo
		// Delete data if it is older than its time to live.
		await binanceDB.deleteExchangeInfo()
		return
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
