import { BinanceConnector, BinanceConnectorRequestArg } from "./connector.js";
import type { BinanceExchangeInfo } from "./types.js";

export class BinanceExchange extends BinanceConnector {
  async publicRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    return await super.request<Data>({ apiKey: "", endpoint, method, params });
  }

  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    const response = await this.publicRequest<BinanceExchangeInfo>(
      "GET",
      "/api/v3/exchangeInfo"
    );
    return response;
  }
}
