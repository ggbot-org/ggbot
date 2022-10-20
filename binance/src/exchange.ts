import { CacheMap } from "@ggbot2/models";
import { BinanceConnector, BinanceConnectorRequestArg } from "./connector.js";
import {
  ErrorInvalidBinanceSymbol,
  ErrorInvalidBinanceKlineInterval,
  ErrorInvalidBinanceKlineOptionalParameters,
} from "./errors.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineOptionalParameters,
  BinanceOrderType,
  BinanceSymbolInfo,
  BinanceTickerPrice,
} from "./types.js";
import {
  isBinanceKlineInterval,
  isBinanceKlineOptionalParameters,
} from "./typeGuards";

/**
BinanceExchange implements public API requests.

@example
```ts
const { BinanceConnector, BinanceExchange } = import "@ggbot2/binance";

const binance = new BinanceExchange({ baseUrl: BinanceConnector.defaultBaseUrl});
```
*/
export class BinanceExchange extends BinanceConnector {
  private async _publicRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    return await super.request<Data>({ endpoint, method, params });
  }

  /**
  Current average price for a symbol.

  {@link https://binance-docs.github.io/apidocs/spot/en/#current-average-price}

  @throws {ErrorInvalidBinanceSymbol}
  */
  async avgPrice(symbol: string): Promise<BinanceAvgPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    return await this._publicRequest<BinanceAvgPrice>(
      "GET",
      "/api/v3/avgPrice",
      { symbol }
    );
  }

  async canTradeSymbol(
    symbol: string,
    orderType: BinanceOrderType
  ): Promise<boolean> {
    try {
      const symbolInfo = await this.symbolInfo(symbol);
      if (!symbolInfo.orderTypes.includes(orderType)) return false;
      if (!symbolInfo.permissions.includes("SPOT")) return false;
      return symbolInfo.status === "TRADING";
    } catch (error) {
      if (error instanceof ErrorInvalidBinanceSymbol) return false;
      throw error;
    }
  }

  /**
  Current exchange trading rules and symbol information.

  {@link https://binance-docs.github.io/apidocs/spot/en/#exchange-information}
  */
  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    const cached = exchangeInfoCache.get("exchangeInfo");
    if (typeof cached !== "undefined") return cached;
    const data = await this._publicRequest<BinanceExchangeInfo>(
      "GET",
      "/api/v3/exchangeInfo"
    );
    exchangeInfoCache.set("exchangeInfo", data);
    return data;
  }

  async isBinanceSymbol(arg: unknown): Promise<boolean> {
    if (typeof arg !== "string") return false;
    // All symbols in Binance are in uppercase.
    if (arg.toUpperCase() !== arg) return false;
    const cached = isValidSymbolCache.get(arg);
    if (typeof cached !== "undefined") return cached;
    const { symbols } = await this.exchangeInfo();
    const isValid = symbols.findIndex(({ symbol }) => arg === symbol) !== -1;
    isValidSymbolCache.set(arg, isValid);
    return isValid;
  }

  /**
   * Kline/Candlestick Data.
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data}
   *
   * @throws {ErrorInvalidBinanceSymbol}
   * @throws {ErrorInvalidBinanceKlineInterval}
   * @throws {ErrorInvalidBinanceKlineOptionalParameters}
   */
  // TODO try also UIKlines api/v3/uiKlines
  async klines(
    symbol: string,
    interval: string,
    optionalParameters: BinanceKlineOptionalParameters
  ): Promise<BinanceKline[]> {
    await this.klinesParametersAreValidOrThrow(
      symbol,
      interval,
      optionalParameters
    );
    return await this._publicRequest<BinanceKline[]>("GET", "/api/v3/klines", {
      symbol,
      interval,
      ...optionalParameters,
    });
  }

  /**
  Validate klines parameters.

  @throws {ErrorInvalidBinanceSymbol}
  @throws {ErrorInvalidBinanceKlineInterval}
  @throws {ErrorInvalidBinanceKlineOptionalParameters}
  */
  async klinesParametersAreValidOrThrow(
    symbol: string,
    interval: string,
    optionalParameters: BinanceKlineOptionalParameters
  ): Promise<void> {
    const isInterval = isBinanceKlineInterval(interval);
    if (!isInterval) throw new ErrorInvalidBinanceKlineInterval(interval);
    const hasParameters = isBinanceKlineOptionalParameters(optionalParameters);
    if (!hasParameters) throw new ErrorInvalidBinanceKlineOptionalParameters();
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
  }

  /**
  UIKlines

  The request is similar to klines having the same parameters and response.

  `uiKlines` return modified kline data, optimized for presentation of candlestick charts.

  {@link https://binance-docs.github.io/apidocs/spot/en/#uiklines}

  @throws {ErrorInvalidBinanceSymbol}
  @throws {ErrorInvalidBinanceKlineInterval}
  @throws {ErrorInvalidBinanceKlineOptionalParameters}
  */
  async uiKlines(
    symbol: string,
    interval: string,
    optionalParameters: BinanceKlineOptionalParameters
  ): Promise<BinanceKline[]> {
    await this.klinesParametersAreValidOrThrow(
      symbol,
      interval,
      optionalParameters
    );
    return await this._publicRequest<BinanceKline[]>(
      "GET",
      "/api/v3/uiKlines",
      {
        symbol,
        interval,
        ...optionalParameters,
      }
    );
  }

  /**
  @throws {ErrorInvalidBinanceSymbol}
  */
  async symbolInfo(symbol: string): Promise<BinanceSymbolInfo> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    const { symbols } = await this.exchangeInfo();
    const symbolInfo = symbols.find((info) => info.symbol === symbol);
    // If `isSymbol` then `symbolInfo` has type `BinanceSymbolInfo`.
    return symbolInfo as BinanceSymbolInfo;
  }

  /**
  Latest price for a symbol.

  {@link https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker}

  @throws {ErrorInvalidBinanceSymbol}
  */
  async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    return await this._publicRequest<BinanceTickerPrice>(
      "GET",
      "/api/v3/ticker/price",
      { symbol }
    );
  }
}

const exchangeInfoCacheTimeToLive = "ONE_DAY";
const exchangeInfoCache = new CacheMap<BinanceExchangeInfo>(
  exchangeInfoCacheTimeToLive
);
// `isValidSymbol` results are cached with same duration as `exchangeInfo`.
const isValidSymbolCache = new CacheMap<boolean>(exchangeInfoCacheTimeToLive);
