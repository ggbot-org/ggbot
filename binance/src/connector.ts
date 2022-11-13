import { ErrorHttpResponse } from "@ggbot2/http-status-codes";
import type { BinanceApiEndpoint } from "./endpoints.js";

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
  static userAgent = "ggbot2 - crypto flow (https://ggbot2.com)";
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

    for (const [key, value] of Object.entries(params))
      url.searchParams.append(key, String(value));

    const headers = new Headers({
      "User-Agent": BinanceConnector.userAgent,
      ...(apiKey ? { "X-MBX-APIKEY": apiKey } : {}),
    });

    const response = await fetch(url, { headers, method });
    if (!response.ok)
      throw new ErrorHttpResponse(response.status, response.statusText);

    const data = await response.json();
    return data as Data;
  }
}

export type BinanceConnectorConstructorArg = Pick<BinanceConnector, "baseUrl">;

export type BinanceConnectorRequestArg = {
  apiKey?: string;
  endpoint: BinanceApiEndpoint;
  method: "GET";
  params?: Record<string, string | number>;
};
