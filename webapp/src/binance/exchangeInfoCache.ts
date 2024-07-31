import { binanceIDB } from "_/storages/indexedDBs"
import { BinanceExchangeInfoCacheIDB } from "@workspace/indexeddb-binance"

export const binanceExchangeInfoCache = new BinanceExchangeInfoCacheIDB(
	binanceIDB
)
