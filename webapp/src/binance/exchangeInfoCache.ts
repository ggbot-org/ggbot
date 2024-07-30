import { binanceIDB } from "_/storages/binanceIDB"
import { BinanceExchangeInfoCacheIDB } from "@workspace/indexeddb-binance"

export const binanceExchangeInfoCache = new BinanceExchangeInfoCacheIDB(
	binanceIDB
)
