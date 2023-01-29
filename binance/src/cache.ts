import { Time, TimeInterval } from "@ggbot2/time";
import { CacheMap } from "@ggbot2/models";
import { getBinanceIntervalTime } from "./time.js";
import {
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
} from "./types.js";
import { isBinanceKline } from "./typeGuards.js";

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

// `isValidSymbolMap` and `exchangeInfoMap` are cached with same duration.
const exchangeInfoCacheDuration = "ONE_DAY";

export class BinanceCacheMap implements BinanceCacheProvider {
  // BinanceExchangeInfoCacheProvider
  // ///////////////////////////////////////////////////////////////////////////

  private readonly exchangeInfoKey = "exchangeInfo";

  private readonly exchangeInfoMap = new CacheMap<BinanceExchangeInfo>(
    exchangeInfoCacheDuration
  );

  getExchangeInfo() {
    return this.exchangeInfoMap.get(this.exchangeInfoKey);
  }

  setExchangeInfo(value: BinanceExchangeInfo | undefined) {
    if (value) this.exchangeInfoMap.set(this.exchangeInfoKey, value);
  }

  // BinanceIsValidSymbolCacheProvider
  // ///////////////////////////////////////////////////////////////////////////

  private readonly isValidSymbolMap = new CacheMap<boolean>(
    exchangeInfoCacheDuration
  );

  getIsValidSymbol(symbol: string) {
    return this.isValidSymbolMap.get(symbol);
  }

  setIsValidSymbol(symbol: string, value: boolean) {
    this.isValidSymbolMap.set(symbol, value);
  }

  // BinanceKlineCacheProvider
  // ///////////////////////////////////////////////////////////////////////////

  static klinesKey(
    symbol: string,
    interval: BinanceKlineInterval,
    openTime: Time
  ) {
    return `${symbol}:${interval}:${openTime}`;
  }

  private readonly klinesMap = new CacheMap<BinanceKline>("ONE_WEEK");

  getKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    timeInterval: TimeInterval
  ) {
    const klines: BinanceKline[] = [];
    let openTime = timeInterval.start;
    while (openTime < timeInterval.end) {
      const key = BinanceCacheMap.klinesKey(symbol, interval, openTime);
      const kline = this.klinesMap.get(key);
      if (!isBinanceKline(kline)) return;
      klines.push(kline);
      openTime = getBinanceIntervalTime[interval](openTime).plus(1);
    }
    return klines;
  }

  setKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    klines: BinanceKline[]
  ) {
    for (const kline of klines) {
      const openTime = kline[0];
      const key = BinanceCacheMap.klinesKey(symbol, interval, openTime);
      this.klinesMap.set(key, kline);
    }
  }
}
