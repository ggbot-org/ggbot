import { ErrorHTTP } from "@ggbot2/http-status-codes";
import { BinanceApiEndpoint } from "./endpoints.js";

const defaultBaseUrl = "https://api.binance.com";
const apiClusters = [
  "https://api1.binance.com",
  "https://api2.binance.com",
  "https://api3.binance.com",
];
const baseUrls = [defaultBaseUrl, ...apiClusters] as const;
type BaseUrl = typeof baseUrls[number];

/** BinanceConnector is a base class for BinanceExchange and BinanceClient. */
export class BinanceConnector {
  static baseUrls = baseUrls;
  static defaultBaseUrl = defaultBaseUrl;
  readonly baseUrl: BaseUrl;

  constructor({
    baseUrl = BinanceConnector.defaultBaseUrl,
  }: BinanceConnectorConstructorArg) {
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
