import { CacheMap, TimeToLive } from "@ggbot2/models";
import { BinanceConnector, BinanceConnectorRequestArg } from "./connector.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  binanceKlineIntervals,
  binanceOrderSides,
  binanceOrderTypes,
} from "./types.js";

/**
 * BinanceExchange implements public API requests
 * and holds some API definitions (e.g. order types, kline intervals, etc.).
 */
export class BinanceExchange extends BinanceConnector {
  private async _publicRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    return await super.request<Data>({ apiKey: "", endpoint, method, params });
  }

  get klineIntervals() {
    return binanceKlineIntervals;
  }
  get orderSides() {
    return binanceOrderSides;
  }
  get orderTypes() {
    return binanceOrderTypes;
  }

  async avgPrice(symbol: string): Promise<BinanceAvgPrice> {
    return await this._publicRequest<BinanceAvgPrice>(
      "GET",
      "/api/v3/avgPrice",
      { symbol }
    );
  }

  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    const cachedData = exchangeInfoCache.get("exchangeInfo");
    if (cachedData) return cachedData;
    const data = await this._publicRequest<BinanceExchangeInfo>(
      "GET",
      "/api/v3/exchangeInfo"
    );
    exchangeInfoCache.set("exchangeInfo", data, TimeToLive.ONE_DAY);
    return data;
  }
}

const exchangeInfoCache = new CacheMap<BinanceExchangeInfo>();
