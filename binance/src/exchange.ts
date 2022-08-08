import { BinanceConnector, BinanceConnectorRequestArg } from "./connector.js";
import {
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceSymbol,
  binanceKlineIntervals,
} from "./types.js";

export class BinanceExchange extends BinanceConnector {
  static readonly klineIntervals = binanceKlineIntervals;

  async publicRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    return await super.request<Data>({ apiKey: "", endpoint, method, params });
  }

  async avgPrice(symbol: BinanceSymbol): Promise<BinanceAvgPrice> {
    return await this.publicRequest<BinanceAvgPrice>(
      "GET",
      "/api/v3/avgPrice",
      { symbol }
    );
  }

  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    return await this.publicRequest<BinanceExchangeInfo>(
      "GET",
      "/api/v3/exchangeInfo"
    );
  }
}
