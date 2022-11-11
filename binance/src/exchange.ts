import { truncateDate } from "@ggbot2/time";
import { BinanceCacheProvider, BinanceCacheMap } from "./cache.js";
import {
  BinanceConnector,
  BinanceConnectorConstructorArg,
  BinanceConnectorRequestArg,
} from "./connector.js";
import {
  ErrorInvalidBinanceSymbol,
  ErrorInvalidBinanceKlineInterval,
  ErrorInvalidBinanceKlineOptionalParameters,
} from "./errors.js";
import { BinanceTimeProvider, getIntervalTime } from "./time.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceKline,
  binanceKlineDefaultLimit,
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceOrderType,
  BinanceSymbolInfo,
  BinanceTicker24hr,
  BinanceTickerPrice,
} from "./types.js";
import {
  isBinanceKlineInterval,
  isBinanceKlineOptionalParameters,
} from "./typeGuards.js";

class DefaultTimeProvider implements BinanceTimeProvider {
  now() {
    return truncateDate(new Date()).to.minutes().getTime();
  }
}

/** BinanceExchange implements public API requests. */
export class BinanceExchange extends BinanceConnector {
  private readonly cache: BinanceCacheProvider;
  private readonly time: BinanceTimeProvider;
  constructor({ baseUrl, cache, time }: BinanceExchangeConstructorArg) {
    super({ baseUrl: baseUrl ?? BinanceConnector.defaultBaseUrl });
    this.cache = cache ?? new BinanceCacheMap();
    this.time = time ?? new DefaultTimeProvider();
  }

  static coerceKlineOptionalParametersToTimeInterval(
    time: BinanceTimeProvider,
    interval: BinanceKlineInterval,
    { startTime, endTime, limit }: BinanceKlineOptionalParameters
  ): { startTime: number; endTime: number } {
    if (startTime) {
      if (endTime) {
        return { startTime, endTime };
      } else {
        return {
          startTime,
          endTime: getIntervalTime[interval](
            startTime,
            limit ?? binanceKlineDefaultLimit
          ),
        };
      }
    } else if (endTime) {
      return {
        startTime: getIntervalTime[interval](
          endTime,
          -1 * (limit ?? binanceKlineDefaultLimit)
        ),
        endTime,
      };
    } else {
      const now = time.now();
      return {
        startTime: getIntervalTime[interval](
          now,
          -1 * (limit ?? binanceKlineDefaultLimit)
        ),
        endTime: now,
      };
    }
  }

  async publicRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    return await super.request<Data>({ endpoint, method, params });
  }

  /** Current average price for a symbol.
{@link https://binance-docs.github.io/apidocs/spot/en/#current-average-price}
@throws {ErrorInvalidBinanceSymbol}
*/
  async avgPrice(symbol: string): Promise<BinanceAvgPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    return await this.publicRequest<BinanceAvgPrice>(
      "GET",
      "/api/v3/avgPrice",
      { symbol }
    );
  }

  /** Check if `symbol` can be traded. */
  async canTradeSymbol(
    symbol: string,
    orderType: BinanceOrderType
  ): Promise<boolean> {
    try {
      const symbolInfo = await this.symbolInfo(symbol);
      if (!symbolInfo) return false;
      if (!symbolInfo.orderTypes.includes(orderType)) return false;
      if (!symbolInfo.permissions.includes("SPOT")) return false;
      return symbolInfo.status === "TRADING";
    } catch (error) {
      if (error instanceof ErrorInvalidBinanceSymbol) return false;
      throw error;
    }
  }

  /** Current exchange trading rules and symbol information.
{@link https://binance-docs.github.io/apidocs/spot/en/#exchange-information}
*/
  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    const cached = this.cache.getExchangeInfo();
    if (cached) return cached;
    const data = await this.publicRequest<BinanceExchangeInfo>(
      "GET",
      "/api/v3/exchangeInfo"
    );
    this.cache.setExchangeInfo(data);
    return data;
  }

  async isBinanceSymbol(arg: unknown): Promise<boolean> {
    if (typeof arg !== "string") return false;
    // All symbols in Binance are in uppercase.
    if (arg.toUpperCase() !== arg) return false;
    const cached = this.cache.getIsValidSymbol(arg);
    if (cached !== undefined) return cached;
    const { symbols } = await this.exchangeInfo();
    const isValid = symbols.findIndex(({ symbol }) => arg === symbol) !== -1;
    this.cache.setIsValidSymbol(arg, isValid);
    return isValid;
  }

  /** Kline/Candlestick Data.
{@link https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data}
@throws {ErrorInvalidBinanceSymbol}
@throws {ErrorInvalidBinanceKlineInterval}
@throws {ErrorInvalidBinanceKlineOptionalParameters}
*/
  async klines(
    symbol: string,
    interval: BinanceKlineInterval,
    optionalParameters: BinanceKlineOptionalParameters
  ): Promise<BinanceKline[]> {
    await this.klinesParametersAreValidOrThrow(
      symbol,
      interval,
      optionalParameters
    );
    const { startTime, endTime } =
      BinanceExchange.coerceKlineOptionalParametersToTimeInterval(
        this.time,
        interval,
        optionalParameters
      );
    const cached = this.cache.getKlines(symbol, interval, startTime, endTime);
    if (cached) return cached;
    const klines = await this.publicRequest<BinanceKline[]>(
      "GET",
      "/api/v3/klines",
      {
        symbol,
        interval,
        ...optionalParameters,
      }
    );
    this.cache.setKlines(symbol, interval, klines);
    return klines;
  }

  /** Validate klines parameters.
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

  /** UIKlines.
The request is similar to klines having the same parameters and response but `uiKlines` return modified kline data, optimized for presentation of candlestick charts.
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
    return await this.publicRequest<BinanceKline[]>("GET", "/api/v3/uiKlines", {
      symbol,
      interval,
      ...optionalParameters,
    });
  }

  /** Get `BinanceSymbolInfo` for `symbol`, if any.
@throws {ErrorInvalidBinanceSymbol}
*/
  async symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    const { symbols } = await this.exchangeInfo();
    const symbolInfo = symbols.find((info) => info.symbol === symbol);
    return symbolInfo;
  }

  /** 24 hour rolling window price change statistics.
{@link https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics}
@throws {ErrorInvalidBinanceSymbol}
*/
  async ticker24hr(symbol: string): Promise<BinanceTicker24hr> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    return await this.publicRequest<BinanceTicker24hr>(
      "GET",
      "/api/v3/ticker/24hr",
      { symbol }
    );
  }

  /** Latest price for a symbol.
{@link https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker}
@throws {ErrorInvalidBinanceSymbol}
*/
  async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    return await this.publicRequest<BinanceTickerPrice>(
      "GET",
      "/api/v3/ticker/price",
      { symbol }
    );
  }
}

export type BinanceExchangeConstructorArg = Partial<
  BinanceConnectorConstructorArg & {
    cache: BinanceCacheProvider;
    time: BinanceTimeProvider;
  }
>;
