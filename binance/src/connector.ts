/**
 * BinanceConnector is a base class for BinanceExchange and BinanceClient.
 */
export class BinanceConnector {
  static defaultBaseUrl = "https://api.binance.com";

  static userAgent = "ggbot2 - crypto flow (https://ggbot2.com)";

  baseUrl: string;

  constructor({
    baseUrl = BinanceConnector.defaultBaseUrl,
  }: BinanceConnectorConstructorArg) {
    this.baseUrl = baseUrl;
  }

  async request<Data>({
    apiKey,
    endpoint,
    method,
    params = {},
  }: BinanceConnectorRequestArg) {
    const url = new URL(this.baseUrl);

    url.pathname = endpoint;

    for (const [key, value] of Object.entries(params))
      url.searchParams.append(key, String(value));

    const headers = new Headers({
      "Content-Type": "application/json",
      "X-MBX-APIKEY": apiKey,
      "User-Agent": BinanceConnector.userAgent,
    });

    const response = await fetch(url, { headers, method });

    if (response.ok) {
      const data = await response.json();
      return data as Data;
    } else {
      throw new Error(response.statusText);
    }
  }
}

export type BinanceConnectorConstructorArg = Partial<
  Pick<BinanceConnector, "baseUrl">
>;

export type BinanceConnectorRequestArg = {
  apiKey: string;
  endpoint: string;
  method: "GET";
  params?: Record<string, string | number>;
};