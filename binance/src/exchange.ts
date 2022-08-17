import { BinanceConnector, BinanceConnectorRequestArg } from "./connector.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  binanceKlineIntervals,
} from "./types.js";

/**
 * BinanceExchange implements public API requests and exposes
 * {@link https://binance-docs.github.io/apidocs/spot/en/#public-api-definitions|Binance public API definitions}
 * as static attributes, for example: orderTypes, orderSides, klineIntervals, etc.
 */
export class BinanceExchange extends BinanceConnector {
  static readonly klineIntervals = binanceKlineIntervals;

  async _publicRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    return await super.request<Data>({ apiKey: "", endpoint, method, params });
  }

  async avgPrice(symbol: string): Promise<BinanceAvgPrice> {
    return await this._publicRequest<BinanceAvgPrice>(
      "GET",
      "/api/v3/avgPrice",
      { symbol }
    );
  }

  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    return await this._publicRequest<BinanceExchangeInfo>(
      "GET",
      "/api/v3/exchangeInfo"
    );
  }
}
