import { CacheMap } from "@ggbot2/models";
import { BinanceConnector, BinanceConnectorRequestArg } from "./connector.js";
import { ErrorInvalidBinanceSymbol } from "./errors.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceNewOrderOptions,
  BinanceOrderType,
  BinanceSymbolInfo,
} from "./types.js";

/**
 * BinanceExchange implements public API requests.
 */
export class BinanceExchange extends BinanceConnector {
  private async _publicRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    return await super.request<Data>({ apiKey: "", endpoint, method, params });
  }

  static filterOrderOptions(
    _symbolInfo: BinanceSymbolInfo,
    _options: BinanceNewOrderOptions
  ): BinanceNewOrderOptions | undefined {
    // TODO apply filters, MIN_NOTIONAL, LOT_SIZE, etc
    return;
  }

  /**
   * Current average price for a symbol.
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#current-average-price}
   *
   * @throws ErrorInvalidBinanceSymbol
   */
  async avgPrice(symbol: string): Promise<BinanceAvgPrice> {
    const isBinanceSymbol = await this.isBinanceSymbol(symbol);
    if (!isBinanceSymbol) throw new ErrorInvalidBinanceSymbol(symbol);

    return await this._publicRequest<BinanceAvgPrice>(
      "GET",
      "/api/v3/avgPrice",
      { symbol }
    );
  }

  async canTradeSymbol({
    orderType,
    symbol,
  }: {
    orderType: BinanceOrderType;
    symbol: unknown;
  }): Promise<boolean> {
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
   * Current exchange trading rules and symbol information.
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#exchange-information}
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

  async isBinanceSymbol(value: unknown): Promise<boolean> {
    if (typeof value !== "string") return false;
    // All symbols in Binance are in uppercase.
    if (value.toUpperCase() !== value) return false;
    const cached = isValidSymbolCache.get(value);
    if (typeof cached !== "undefined") return cached;
    const { symbols } = await this.exchangeInfo();
    const isValid = symbols.findIndex(({ symbol }) => value === symbol) !== -1;
    isValidSymbolCache.set(value, isValid);
    return isValid;
  }

  /**
   * @throws ErrorInvalidBinanceSymbol
   */
  async symbolInfo(symbol: unknown): Promise<BinanceSymbolInfo> {
    const isBinanceSymbol = await this.isBinanceSymbol(symbol);
    if (!isBinanceSymbol) throw new ErrorInvalidBinanceSymbol(symbol);
    const { symbols } = await this.exchangeInfo();
    const symbolInfo = symbols.find((info) => info.symbol === symbol);
    // If `isBinanceSymbol` then `symbolInfo` has type `BinanceSymbolInfo`.
    return symbolInfo as BinanceSymbolInfo;
  }
}

const exchangeInfoCacheTimeToLive = "ONE_DAY";
const exchangeInfoCache = new CacheMap<BinanceExchangeInfo>(
  exchangeInfoCacheTimeToLive
);
// `isValidSymbol` results are cached with same duration as `exchangeInfo`.
const isValidSymbolCache = new CacheMap<boolean>(exchangeInfoCacheTimeToLive);
