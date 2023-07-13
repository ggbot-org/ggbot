import { ErrorHTTP } from "@ggbot2/http";

import { BinanceApiEndpoint } from "./endpoints.js";

/** BinanceConnector is a base class for Binance clients. */
export class BinanceConnector {
  readonly baseUrl: string;

  constructor({ baseUrl }: BinanceConnectorConstructorArg) {
    this.baseUrl = baseUrl;
  }

  async request<Data>({
    apiKey = "",
    endpoint,
    method,
    params = {},
  }: BinanceConnectorRequestArg) {
    const url = new URL(this.baseUrl);
    url.pathname = endpoint;

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      // The array conversion logic is different from usual query string.
      // E.g. symbols=["BTCUSDT","BNBBTC"] instead of symbols[]=BTCUSDT&symbols[]=BNBBTC
      const valueString = Array.isArray(value)
        ? `["${value.join('","')}"]`
        : value;
      url.searchParams.append(key, String(valueString));
    }

    const headers = new Headers({
      ...(apiKey ? { "X-MBX-APIKEY": apiKey } : {}),
    });

    const fetchOptions: RequestInit = { headers, method };

    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new ErrorHTTP(response);

    const data = await response.json();
    return data as Data;
  }
}

export type BinanceConnectorConstructorArg = Pick<BinanceConnector, "baseUrl">;

export type BinanceConnectorRequestArg = {
  apiKey?: string;
  endpoint: BinanceApiEndpoint;
  method: "GET" | "POST";
  params?: Record<string, string | number>;
};
