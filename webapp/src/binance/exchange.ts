import { BinanceConnector, BinanceExchange } from "@workspace/binance"

import { binanceExchangeInfoCacheSessionWebStorage } from "./exchangeInfoCacheSessionWebStorage.js"

export const binance = new BinanceExchange(
	BinanceConnector.defaultBaseUrl,
	binanceExchangeInfoCacheSessionWebStorage
)
