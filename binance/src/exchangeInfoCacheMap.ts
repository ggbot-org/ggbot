import { CacheMap } from "@ggbot2/models";

import { BinanceExchangeInfoCacheProvider } from "./cacheProviders.js";
import { BinanceExchangeInfo } from "./types.js";

// `isValidSymbolMap` and `exchangeInfoMap` are cached with same duration.
const exchangeInfoCacheDuration = "ONE_DAY";

export class BinanceExchangeInfoCacheMap
  implements BinanceExchangeInfoCacheProvider
{
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

  private readonly isValidSymbolMap = new CacheMap<boolean>(exchangeInfoCacheDuration);

  getIsValidSymbol(symbol: string) {
    return this.isValidSymbolMap.get(symbol);
  }

  setIsValidSymbol(symbol: string, value: boolean) {
    this.isValidSymbolMap.set(symbol, value);
  }
}
