import { binanceDB } from "_/storages/binanceDB"
import {
	BinanceExchangeInfo,
	BinanceExchangeInfoCacheProvider
} from "@workspace/binance"

const ONE_DAY = 86_400_000

export class BinanceExchangeInfoCache
	implements BinanceExchangeInfoCacheProvider
{
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
}

export const binanceExchangeInfoCache = new BinanceExchangeInfoCache()
