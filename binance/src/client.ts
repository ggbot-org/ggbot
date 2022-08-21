import { createHmac } from "crypto";
import {
  BinanceConnector,
  BinanceConnectorConstructorArg,
  BinanceConnectorRequestArg,
} from "./connector.js";
import { BinanceAccountInformation, BinanceApiKeyPermission } from "./types.js";

/**
 * BinanceClient implements private API requests.
 */
export class BinanceClient extends BinanceConnector {
  apiKey: string;
  apiSecret: string;

  constructor({ apiKey, apiSecret, baseUrl }: BinanceClientConstructorArg) {
    super({ baseUrl });
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private async _privateRequest<Data>(
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

    return await super.request<Data>({
      apiKey: this.apiKey,
      endpoint,
      method,
      params: Object.fromEntries(searchParams),
    });
  }

  async account(): Promise<BinanceAccountInformation> {
    const { balances, ...rest } =
      await this._privateRequest<BinanceAccountInformation>(
        "GET",
        "/api/v3/account"
      );

    return {
      balances: balances.filter(
        // Filter empty balances
        //
        // An empty balance looks like
        //
        //     { asset: 'LUNA', free: '0.00000000', locked: '0.00000000' }
        //
        ({ free, locked }) => Number(free) + Number(locked) > 0
      ),
      ...rest,
    };
  }

  async apiRestrictions(): Promise<BinanceApiKeyPermission> {
    return await this._privateRequest<BinanceApiKeyPermission>(
      "GET",
      "/api/v3/account/apiRestrictions"
    );
  }
}

export type BinanceClientConstructorArg = BinanceConnectorConstructorArg &
  Pick<BinanceClient, "apiKey" | "apiSecret">;
