import { BinanceExchange } from "@ggbot2/binance";

import { BinanceCacheSessionWebStorage } from "./cache.js";
export const binance = new BinanceExchange();
binance.exchangeInfoCache = new BinanceCacheSessionWebStorage();
