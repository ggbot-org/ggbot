import { createHmac } from "crypto";
import {
  BinanceConnector,
  BinanceConnectorConstructorArg,
  BinanceConnectorRequestArg,
} from "./connector.js";

type ApiKey = string;
type ApiSecret = string;

export type BinanceClientConstructorArg = BinanceConnectorConstructorArg & {
  apiKey: ApiKey;
  apiSecret: ApiSecret;
};

export class BinanceClient extends BinanceConnector {
  apiKey: ApiKey;
  apiSecret: ApiSecret;

  constructor({
    apiKey,
    apiSecret,
    baseUrl = BinanceConnector.defaultBaseUrl,
  }: BinanceClientConstructorArg) {
    super({ baseUrl });
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async privateRequest(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
  ) {
    const searchParams = new URLSearchParams();

    if (typeof params !== "undefined")
      for (const [key, value] of Object.entries(params))
        searchParams.append(key, String(value));

    const timestamp = Date.now();
    searchParams.append("timestamp", String(timestamp));
    // recvWindow defaults to 5000 and the maximum is 60000
    searchParams.append("recvWindow", "10000");

    const signature = createHmac("sha256", this.apiSecret)
      .update(searchParams.toString())
      .digest("hex");
    searchParams.append("signature", signature);

    return await super.request({
      apiKey: this.apiKey,
      endpoint,
      method,
      params: Object.fromEntries(searchParams),
    });
  }
}
