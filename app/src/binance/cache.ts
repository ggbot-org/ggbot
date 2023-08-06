import {
  BinanceExchangeInfo,
  BinanceExchangeInfoCacheProvider,
} from "@ggbot2/binance";
import { CacheMap } from "@ggbot2/models";
import { sessionWebStorage } from "@ggbot2/web-storage";

export class BinanceCacheSessionWebStorage
  implements BinanceExchangeInfoCacheProvider
{
  readonly isValidSymbolMap = new CacheMap<boolean>();

  getExchangeInfo(): BinanceExchangeInfo | undefined {
    return sessionWebStorage.binanceExchangeInfo;
  }

  setExchangeInfo(arg: BinanceExchangeInfo): void {
    sessionWebStorage.binanceExchangeInfo = arg;
  }

  getIsValidSymbol(symbol: string) {
    return this.isValidSymbolMap.get(symbol);
  }

  setIsValidSymbol(symbol: string, value: boolean) {
    this.isValidSymbolMap.set(symbol, value);
  }
}


