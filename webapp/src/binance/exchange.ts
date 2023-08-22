import { BinanceConnector, BinanceExchange } from "@ggbot2/binance"

import { binanceExchangeInfoCacheSessionWebStorage } from "./exchangeInfoCacheSessionWebStorage.js"

export const binance = new BinanceExchange(
	BinanceConnector.defaultBaseUrl,
	binanceExchangeInfoCacheSessionWebStorage
)
