import { Time, TimeInterval, truncateTime } from "@ggbot2/time";

import { BinanceExchangeInfoCacheProvider } from "./cacheProviders.js";
import { BinanceConnector } from "./connector.js";
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
import { getBinanceIntervalTime } from "./time.js";
import {
  isBinanceKlineInterval,
  isBinanceKlineOptionalParameters,
  isBinanceOrderSide,
  isBinanceOrderType,
} from "./typeGuards.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceKline,
  binanceKlineDefaultLimit,
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceNewOrderOptions,
  BinanceOrderSide,
  BinanceOrderType,
  BinanceSymbolFilterLotSize,
  BinanceSymbolFilterMinNotional,
  BinanceSymbolInfo,
  BinanceTicker24hr,
  BinanceTickerPrice,
} from "./types.js";

/**
 * BinanceExchange implements public API requests.
 *
 * It can use an `exchangeInfoCache` instance, that is any class implementing
 * `BinanceExchangeInfoCacheProvider`, for example
 * `BinanceExchangeInfoCacheMap`.
 *
 * @example
 *
 * ```ts
 * import {
 *   BinanceConnector,
 *   BinanceExchange,
 *   BinanceExchangeInfoCacheMap,
 * } from "@ggbot2/binance";
 *
 * const exchangeInfoCache = new BinanceExchangeInfoCacheMap();
 * const binance = new BinanceExchange(BinanceConnector.defaultBaseUrl, exchangeInfoCache);
 * ```
 */
export class BinanceExchange {
  readonly connector: BinanceConnector;

  private readonly exchangeInfoCache: BinanceExchangeInfoCacheProvider | undefined;

  constructor(baseUrl?: string, exchangeInfoCache?: BinanceExchange['exchangeInfoCache']) {
    this.connector = new BinanceConnector(baseUrl);
    this.exchangeInfoCache = exchangeInfoCache
  }

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

  static throwIfLotSizeFilterIsInvalid(
    quantity: Exclude<BinanceNewOrderOptions["quantity"], undefined>,
    lotSizeFilter?: BinanceSymbolFilterLotSize
  ) {
    if (lotSizeFilter && !lotSizeIsValid(lotSizeFilter, quantity))
      throw new ErrorBinanceSymbolFilter({ filterType: "LOT_SIZE" });
  }

  // TODO this may be removed
  static coerceKlineOptionalParametersToTimeInterval(
    interval: BinanceKlineInterval,
    { startTime, endTime, limit }: BinanceKlineOptionalParameters,
    currentTime?: Time
  ): TimeInterval {
    if (startTime) {
      if (endTime) {
        return { start: startTime, end: endTime };
      } else {
        return {
          start: startTime,
          end: getBinanceIntervalTime[interval](startTime).plus(
            limit ?? binanceKlineDefaultLimit
          ),
        };
      }
    } else if (endTime) {
      return {
        start: getBinanceIntervalTime[interval](endTime).minus(
          limit ?? binanceKlineDefaultLimit
        ),
        end: endTime,
      };
    } else if (limit && currentTime) {
      const endTime = truncateTime(currentTime).to.second();
      return {
        start: getBinanceIntervalTime[interval](endTime).minus(limit),
        end: endTime,
      };
    }
    throw new Error();
  }

  /**
   * Validate order parameters and try to adjust them; otherwise throw an error.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
   */
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
      () => BinanceNewOrderOptions
    > = {
      LIMIT: () => {
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

      LIMIT_MAKER: () => {
        if (quantity === undefined) throw new ErrorBinanceInvalidOrderOptions();
        if (price === undefined) throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      MARKET: () => {
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

      STOP_LOSS: () => {
        if (quantity === undefined) throw new ErrorBinanceInvalidOrderOptions();
        if (stopPrice === undefined && trailingDelta === undefined)
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      STOP_LOSS_LIMIT: () => {
        if (
          timeInForce === undefined ||
          quantity === undefined ||
          price === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      TAKE_PROFIT: () => {
        if (
          quantity === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },

      TAKE_PROFIT_LIMIT: () => {
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

    return { symbol, options: prepareOptions[orderType]() };
  }
  /**
   * Current average price for a symbol.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#current-average-price}
   */
  async avgPrice(symbol: string): Promise<BinanceAvgPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
    return await this.connector.request<BinanceAvgPrice>(
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

  /**
   * Current exchange trading rules and symbol information.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#exchange-information}
   */
  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    const { exchangeInfoCache: cache } = this;
    const cached = cache?.getExchangeInfo();
    if (cached) return cached;
    const data = await this.connector.request<BinanceExchangeInfo>(
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
    const { exchangeInfoCache: cache } = this;
    const cached = cache?.getIsValidSymbol(arg);
    if (cached) return cached;
    const { symbols } = await this.exchangeInfo();
    const isValid = symbols.findIndex(({ symbol }) => arg === symbol) !== -1;
    cache?.setIsValidSymbol(arg, isValid);
    return isValid;
  }

  /**
   * Kline/Candlestick Data.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data}
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
    const klines = await this.connector.request<BinanceKline[]>(
      "GET",
      "/api/v3/klines",
      {
        symbol,
        interval,
        ...optionalParameters,
      }
    );
    return klines;
  }

  /** Validate klines parameters. */
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

  /**
   * UIKlines.
   *
   * The request is similar to klines having the same parameters and response
   * but `uiKlines` return modified kline data, optimized for presentation of
   * candlestick charts.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#uiklines}
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
    return await this.connector.request<BinanceKline[]>(
      "GET",
      "/api/v3/uiKlines",
      {
        symbol,
        interval,
        ...optionalParameters,
      }
    );
  }

  /** Get `BinanceSymbolInfo` for `symbol`, if any. */
  async symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
    const { symbols } = await this.exchangeInfo();
    const symbolInfo = symbols.find((info) => info.symbol === symbol);
    return symbolInfo;
  }

  /**
   * 24 hour rolling window price change statistics.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#24hr-ticker-price-change-statistics}
   */
  async ticker24hr(symbol: string): Promise<BinanceTicker24hr> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
    return await this.connector.request<BinanceTicker24hr>(
      "GET",
      "/api/v3/ticker/24hr",
      { symbol }
    );
  }

  /**
   * Latest price for a symbol.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#symbol-price-ticker}
   */
  async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
    const isSymbol = await this.isBinanceSymbol(symbol);
    if (!isSymbol)
      throw new ErrorBinanceInvalidArg({ arg: symbol, type: "symbol" });
    return await this.connector.request<BinanceTickerPrice>(
      "GET",
      "/api/v3/ticker/price",
      { symbol }
    );
  }
}
