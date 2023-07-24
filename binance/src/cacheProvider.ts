import { TimeInterval } from "@ggbot2/time";

import {
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
} from "./types.js";

type BinanceExchangeInfoCacheProvider = {
  getExchangeInfo(): BinanceExchangeInfo | undefined;
  setExchangeInfo(arg: BinanceExchangeInfo): void;
};

type BinanceIsValidSymbolCacheProvider = {
  getIsValidSymbol(symbol: string): boolean | undefined;
  setIsValidSymbol(symbol: string, value: boolean): void;
};

type BinanceKlineCacheProvider = {
  getKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    timeInterval: TimeInterval
  ): BinanceKline[] | undefined;
  setKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    klines: BinanceKline[]
  ): void;
};

export type BinanceCacheProvider = BinanceExchangeInfoCacheProvider &
  BinanceIsValidSymbolCacheProvider &
  BinanceKlineCacheProvider;
