import { BinanceConnector, BinanceExchange } from "@workspace/binance"

import { binanceExchangeInfoCache } from "./exchangeInfoCache"

export const binance = new BinanceExchange(BinanceConnector.defaultBaseUrl)
binance.exchangeInfoCache = binanceExchangeInfoCache
