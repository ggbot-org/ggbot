import { BinanceConnector, BinanceConnectorRequestArg } from "./connector.js";
import { BinanceAvgPrice, BinanceExchangeInfo } from "./types.js";

/**
 * BinanceExchange implements public API requests.
 */
export class BinanceExchange extends BinanceConnector {
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
