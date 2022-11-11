import type { Time } from "@ggbot2/time";
import { CacheMap } from "@ggbot2/models";
import { getIntervalTime } from "./time.js";
import type {
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
} from "./types.js";

interface BinanceExchangeInfoCacheProvider {
  getExchangeInfo(): BinanceExchangeInfo | undefined;
  setExchangeInfo(arg: BinanceExchangeInfo): void;
}

interface BinanceIsValidSymbolCacheProvider {
  getIsValidSymbol(symbol: string): boolean | undefined;
  setIsValidSymbol(symbol: string, value: boolean): void;
}

interface BinanceKlineCacheProvider {
  getKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    startTime: Time,
    endTime: Time
  ): BinanceKline[] | undefined;
  setKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    klines: BinanceKline[]
  ): void;
}

export interface BinanceCacheProvider
  extends BinanceExchangeInfoCacheProvider,
    BinanceIsValidSymbolCacheProvider,
    BinanceKlineCacheProvider {}

// `isValidSymbolMap` and `exchangeInfoMap` are cached with same duration.
const exchangeInfoCacheDuration = "ONE_DAY";

export class BinanceCacheMap implements BinanceCacheProvider {
  // BinanceExchangeInfoCacheProvider
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
  private readonly klinesMap = new CacheMap<BinanceKline>();
  private klinesKey(
    symbol: string,
    interval: BinanceKlineInterval,
    openTime: Time
  ) {
    return `${symbol}:${interval}:${openTime}`;
  }
  getKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    startTime: Time,
    endTime: Time
  ) {
    let nextTime = getIntervalTime[interval](startTime, 1);
    const klines: BinanceKline[] = [];
    while (nextTime < endTime) {
      const key = this.klinesKey(symbol, interval, nextTime);
      const kline = this.klinesMap.get(key);
      // At first hole found, return.
      if (!kline) return;
      klines.push(kline);
      nextTime = getIntervalTime[interval](nextTime, 1);
    }
    return klines;
  }
  setKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    klines: BinanceKline[]
  ) {
    for (const kline of klines) {
      const [openTime] = kline;
      const key = this.klinesKey(symbol, interval, openTime);
      this.klinesMap.set(key, kline);
    }
  }
}
