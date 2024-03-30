import { binanceIDB } from "_/storages/binanceIDB"
import { BinanceExchangeInfoCacheIDB } from "@workspace/binance-indexeddb"

export const binanceExchangeInfoCache = new BinanceExchangeInfoCacheIDB(
	binanceIDB
)
