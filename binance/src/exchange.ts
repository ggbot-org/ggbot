import type { TimeInterval } from "@ggbot2/time";
import type { BinanceCacheProvider } from "./cache.js";
import {
  BinanceConnector,
  BinanceConnectorConstructorArg,
  BinanceConnectorRequestArg,
} from "./connector.js";
import {
  ErrorBinanceCannotTradeSymbol,
  ErrorBinanceInvalidArg,
  ErrorBinanceInvalidKlineOptionalParameters,
  ErrorBinanceInvalidOrderOptions,
  ErrorBinanceSymbolFilter,
} from "./errors.js";
import {
  findSymbolFilterLotSize,
  findSymbolFilterMinNotional,
  lotSizeIsValid,
  minNotionalIsValid,
} from "./symbolFilters.js";
import { BinanceTimeProvider, getIntervalTime } from "./time.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceNewOrderOptions,
  BinanceOrderSide,
  BinanceOrderType,
  BinanceSymbolFilterMinNotional,
  BinanceSymbolFilterLotSize,
  BinanceSymbolInfo,
  BinanceTicker24hr,
  BinanceTickerPrice,
  binanceKlineDefaultLimit,
} from "./types.js";
import {
  isBinanceKlineInterval,
  isBinanceKlineOptionalParameters,
  isBinanceOrderSide,
  isBinanceOrderType,
} from "./typeGuards.js";

/** BinanceExchange implements public API requests.
To create a cached client, pass a `BinanceCacheProvider` and a `BinanceTimeProvider` to the constructor.
@example
```ts
import { truncateDate } from "@ggbot2/time";
import {
  BinanceCacheMap,
  BinanceConnector,
  BinanceExchange,
  BinanceTimeProvider
} from '@ggbot2/binance'
class TimeProvider implements BinanceTimeProvider {
  now() {
    return truncateDate(new Date()).to.minutes().getTime();
  }
}
const time = new TimeProvider();
const cache = new BinanceCacheMap();
const binance = new BinanceExchange({
  baseUrl: BinanceConnector.defaultBaseUrl,
  cache: new BinanceCacheMap(),
  time: new TimeProvider()
});
``` */
export class BinanceExchange extends BinanceConnector {
  private readonly cache: BinanceCacheProvider | undefined;
  private readonly time: BinanceTimeProvider | undefined;
  constructor({ baseUrl, cache, time }: BinanceExchangeConstructorArg) {
    super({ baseUrl });
    this.cache = cache;
    this.time = time;
  }

  /** @throws {ErrorBinanceSymbolFilter} */
  static throwIfMinNotionalFilterIsInvalid(
    quoteOrderQty: Exclude<BinanceNewOrderOptions["quoteOrderQty"], undefined>,
    type: BinanceOrderType,
    minNotionalFilter?: BinanceSymbolFilterMinNotional
  ) {
    if (minNotionalFilter === undefined) return;
    if (type === "MARKET" && minNotionalFilter.applyToMarket !== true) return;
    if (!minNotionalIsValid(minNotionalFilter, quoteOrderQty))
      throw new ErrorBinanceSymbolFilter({ filterType: "MIN_NOTIONAL" });
  }

  /** @throws {ErrorBinanceSymbolFilter} */
  static throwIfLotSizeFilterIsInvalid(
    quantity: Exclude<BinanceNewOrderOptions["quantity"], undefined>,
    lotSizeFilter?: BinanceSymbolFilterLotSize
  ) {
    if (lotSizeFilter && !lotSizeIsValid(lotSizeFilter, quantity))
      throw new ErrorBinanceSymbolFilter({ filterType: "LOT_SIZE" });
  }

  static coerceKlineOptionalParametersToTimeInterval(
    time: BinanceTimeProvider,
    interval: BinanceKlineInterval,
    { startTime, endTime, limit }: BinanceKlineOptionalParameters
  ): TimeInterval {
    if (startTime) {
      if (endTime) {
        return { start: startTime, end: endTime };
      } else {
        return {
          start: startTime,
          end: getIntervalTime[interval](
            startTime,
            limit ?? binanceKlineDefaultLimit
          ),
        };
      }
    } else if (endTime) {
      return {
        start: getIntervalTime[interval](
          endTime,
          -1 * (limit ?? binanceKlineDefaultLimit)
        ),
        end: endTime,
      };
    } else {
      const now = time.now();
      return {
        start: getIntervalTime[interval](
          now,
          -1 * (limit ?? binanceKlineDefaultLimit)
        ),
        end: now,
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
@throws {ErrorInvalidArg} */
  async avgPrice(symbol: string): Promise<BinanceAvgPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
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
      if (error instanceof ErrorBinanceInvalidArg) return false;
      throw error;
    }
  }

  /** Current exchange trading rules and symbol information.
{@link https://binance-docs.github.io/apidocs/spot/en/#exchange-information} */
  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    const { cache } = this;
    const cached = cache?.getExchangeInfo();
    if (cached) return cached;
    const data = await this.publicRequest<BinanceExchangeInfo>(
      "GET",
      "/api/v3/exchangeInfo"
    );
    cache?.setExchangeInfo(data);
    return data;
  }

  async isBinanceSymbol(arg: unknown): Promise<boolean> {
    if (typeof arg !== "string") return false;
    // All symbols in Binance are in uppercase.
    if (arg.toUpperCase() !== arg) return false;
    const { cache } = this;
    const cached = cache?.getIsValidSymbol(arg);
    if (cached) return cached;
    const { symbols } = await this.exchangeInfo();
    const isValid = symbols.findIndex(({ symbol }) => arg === symbol) !== -1;
    cache?.setIsValidSymbol(arg, isValid);
    return isValid;
  }

  /** Kline/Candlestick Data.
{@link https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data}
@throws {ErrorBinanceInvalidArg}
@throws {ErrorBinanceInvalidKlineOptionalParameters} */
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
    const { cache, time } = this;
    if (cache && time) {
      const timeInterval =
        BinanceExchange.coerceKlineOptionalParametersToTimeInterval(
          time,
          interval,
          optionalParameters
        );
      const cached = cache.getKlines(symbol, interval, timeInterval);
      if (cached) return cached;
    }
    const klines = await this.publicRequest<BinanceKline[]>(
      "GET",
      "/api/v3/klines",
      {
        symbol,
        interval,
        ...optionalParameters,
      }
    );
    cache?.setKlines(symbol, interval, klines);
    return klines;
  }

  /** Validate klines parameters.
@throws {ErrorBinanceInvalidArg}
@throws {ErrorBinanceInvalidKlineOptionalParameters} */
  async klinesParametersAreValidOrThrow(
    symbol: string,
    interval: string,
    optionalParameters: BinanceKlineOptionalParameters
  ): Promise<void> {
    if (!isBinanceKlineInterval(interval))
      throw new ErrorBinanceInvalidArg({
        arg: interval,
        type: "klineInterval",
      });
    if (!isBinanceKlineOptionalParameters(optionalParameters))
      throw new ErrorBinanceInvalidKlineOptionalParameters();
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
  }

  /** UIKlines.
The request is similar to klines having the same parameters and response but `uiKlines` return modified kline data, optimized for presentation of candlestick charts.
{@link https://binance-docs.github.io/apidocs/spot/en/#uiklines}
@throws {ErrorBinanceInvalidArg}
@throws {ErrorBinanceInvalidKlineOptionalParameters} */
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

  /** Validate order parameters and try to adjust them; otherwise throw an error.
@see {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
@throws {ErrorBinanceCannotTradeSymbol}
@throws {ErrorBinanceInvalidArg} */
  async prepareOrder(
    symbol: string,
    side: BinanceOrderSide,
    orderType: BinanceOrderType,
    orderOptions: BinanceNewOrderOptions
  ): Promise<{ options: BinanceNewOrderOptions; symbol: string }> {
    if (!isBinanceOrderSide(side))
      throw new ErrorBinanceInvalidArg({ arg: side, type: "orderSide" });
    if (!isBinanceOrderType(orderType))
      throw new ErrorBinanceInvalidArg({
        arg: orderType,
        type: "orderType",
      });
    const symbolInfo = await this.symbolInfo(symbol);
    if (!symbolInfo || !this.canTradeSymbol(symbol, orderType))
      throw new ErrorBinanceCannotTradeSymbol({ symbol, orderType });

    const { filters } = symbolInfo;

    const lotSizeFilter = findSymbolFilterLotSize(filters);
    const minNotionalFilter = findSymbolFilterMinNotional(filters);

    const {
      price,
      quantity,
      quoteOrderQty,
      stopPrice,
      timeInForce,
      trailingDelta,
    } = orderOptions;

    const prepareOptions: Record<
      BinanceOrderType,
      () => Promise<BinanceNewOrderOptions>
    > = {
      LIMIT: async () => {
        if (price === undefined) throw new ErrorBinanceInvalidOrderOptions();
        if (quoteOrderQty === undefined)
          throw new ErrorBinanceInvalidOrderOptions();
        if (timeInForce === undefined)
          throw new ErrorBinanceInvalidOrderOptions();
        BinanceExchange.throwIfMinNotionalFilterIsInvalid(
          quoteOrderQty,
          orderType,
          minNotionalFilter
        );
        return orderOptions;
      },

      LIMIT_MAKER: async () => {
        if (quantity === undefined) throw new ErrorBinanceInvalidOrderOptions();
        if (price === undefined) throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      MARKET: async () => {
        if (quantity === undefined && quoteOrderQty === undefined)
          throw new ErrorBinanceInvalidOrderOptions();
        if (quantity) {
          BinanceExchange.throwIfLotSizeFilterIsInvalid(
            quantity,
            lotSizeFilter
          );
          return { quantity };
        }
        if (quoteOrderQty) {
          BinanceExchange.throwIfMinNotionalFilterIsInvalid(
            quoteOrderQty,
            orderType,
            minNotionalFilter
          );
        }
        return { quoteOrderQty };
      },

      STOP_LOSS: async () => {
        if (quantity === undefined) throw new ErrorBinanceInvalidOrderOptions();
        if (stopPrice === undefined && trailingDelta === undefined)
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      STOP_LOSS_LIMIT: async () => {
        if (
          timeInForce === undefined ||
          quantity === undefined ||
          price === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      TAKE_PROFIT: async () => {
        if (
          quantity === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      TAKE_PROFIT_LIMIT: async () => {
        if (
          timeInForce === undefined ||
          quantity === undefined ||
          price === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
    };

    const options = await prepareOptions[orderType]();
    return { symbol, options };
  }

  /** Get `BinanceSymbolInfo` for `symbol`, if any.
@throws {ErrorBinanceInvalidArg} */
  async symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
    const { symbols } = await this.exchangeInfo();
    const symbolInfo = symbols.find((info) => info.symbol === symbol);
    return symbolInfo;
  }

  /** 24 hour rolling window price change statistics.
{@link https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics}
@throws {ErrorBinanceInvalidArg} */
  async ticker24hr(symbol: string): Promise<BinanceTicker24hr> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
    return await this.publicRequest<BinanceTicker24hr>(
      "GET",
      "/api/v3/ticker/24hr",
      { symbol }
    );
  }

  /** Latest price for a symbol.
{@link https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker}
@throws {ErrorBinanceInvalidArg} */
  async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
    return await this.publicRequest<BinanceTickerPrice>(
      "GET",
      "/api/v3/ticker/price",
      { symbol }
    );
  }
}

export type BinanceExchangeConstructorArg = BinanceConnectorConstructorArg & {
  cache?: BinanceCacheProvider | undefined;
  time?: BinanceTimeProvider | undefined;
};
