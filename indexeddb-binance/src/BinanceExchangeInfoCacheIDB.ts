import {
	BinanceExchangeInfo,
	BinanceExchangeInfoCacheProvider
} from "@workspace/binance"

import { BinanceIDB } from "./BinanceIDB.js"

const ONE_DAY = 86_400_000

export class BinanceExchangeInfoCacheIDB
implements BinanceExchangeInfoCacheProvider {
	private binanceIDB: BinanceIDB

	constructor(binanceIDB: BinanceExchangeInfoCacheIDB["binanceIDB"]) {
		this.binanceIDB = binanceIDB
	}

	async getExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		const exchangeInfo = await this.binanceIDB.readExchangeInfo()
		if (!exchangeInfo) return
		// Check `exchangeInfo` time to live and return data.
		if (Date.now() - exchangeInfo.serverTime < ONE_DAY) return exchangeInfo
		// Delete data if it is older than its time to live.
		await this.binanceIDB.deleteExchangeInfo()
		return
	}

	setExchangeInfo(arg: BinanceExchangeInfo): Promise<void> {
		return this.binanceIDB.writeExchangeInfo(arg)
	}
}
