import { BinanceConnector, BinanceExchange } from "@workspace/binance"

import { binanceExchangeInfoCacheSessionWebStorage } from "./exchangeInfoCacheSessionWebStorage"

export const binance = new BinanceExchange(
	BinanceConnector.defaultBaseUrl,
	binanceExchangeInfoCacheSessionWebStorage
)
