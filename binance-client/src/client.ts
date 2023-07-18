import { createHmac } from "node:crypto";

import {
  balanceIsNotEmpty,
  BinanceAccountInformation,
  BinanceApiKeyPermission,
  BinanceApiPrivateEndpoint,
  BinanceApiRequestMethod,
  BinanceApiRequestParams,
  BinanceExchange,
  BinanceNewOrderOptions,
  BinanceOrderRespACK,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";

/**
 * BinanceClient implements private and public Binance API requests.
 *
 * Binance restricts _Spot & Margin Trading_ APIs to trusted IPs only. The
 * constructor accepts a `baseUrl` parameter which can be for example:
 *
 * - `https://api.binance.com`: if the process run on a server with a trusted IP
 *   associated. In this case it could be also `https://api1.binance.com` or any
 *   other Binance API cluster.
 * - `BINANCE_PROXY_BASE_URL` environment variable: if the process run elsewhere
 *   and the proxy has a trusted IP associated.
 *
 * Notice that the _trusted IP_ must be configured on the Binance account for
 * the given `apiKey` provided as parameter to the constructor.
 */
export class BinanceClient extends BinanceExchange {
  readonly apiSecret: string;

  constructor(apiKey: string, apiSecret: string, baseUrl: string) {
    super(baseUrl);
    this.connector.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async privateRequest<Data>(
    method: BinanceApiRequestMethod,
    endpoint: BinanceApiPrivateEndpoint,
    params?: BinanceApiRequestParams
  ) {
    const searchParams = new URLSearchParams();
    if (params)
      for (const [key, value] of Object.entries(params))
        searchParams.append(key, String(value));

    const timestamp = Date.now();
    searchParams.append("timestamp", String(timestamp));

    const signature = createHmac("sha256", this.apiSecret)
      .update(searchParams.toString())
      .digest("hex");
    searchParams.append("signature", signature);

    return await this.connector.request<Data>(
      method,
      endpoint,
      Object.fromEntries(searchParams)
    );
  }

  /**
   * Account Information (USER_DATA)
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data}
   */
  async account(): Promise<BinanceAccountInformation> {
    const { balances, ...rest } =
      await this.privateRequest<BinanceAccountInformation>(
        "GET",
        "/api/v3/account"
      );

    return {
      // Filter empty balances
      balances: balances.filter(balanceIsNotEmpty),
      ...rest,
    };
  }

  async apiRestrictions(): Promise<BinanceApiKeyPermission> {
    try {
      const response = await this.privateRequest<BinanceApiKeyPermission>(
        "GET",
        "/sapi/v1/account/apiRestrictions"
      );
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Send in a new order.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
   */
  async newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL> {
    const { options, symbol: _symbol } = await this.prepareOrder(
      symbol,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespFULL>(
      "POST",
      "/api/v3/order",
      {
        symbol: _symbol,
        side,
        type,
        ...options,
      }
    );
  }

  /**
   * Test a new order.
   *
   * Binance API will validate new order but will not send it into the matching
   * engine. Parameters are the same as `newOrder`.
   */
  async newOrderTest(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL> {
    const { options, symbol: _symbol } = await this.prepareOrder(
      symbol,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespFULL>(
      "POST",
      "/api/v3/order/test",
      {
        symbol: _symbol,
        side,
        type,
        ...options,
      }
    );
  }

  /**
   * Send in a new order with type other than MARKET or LIMIT order.
   *
   * @see {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
   */
  async newOrderACK(
    symbol: string,
    side: BinanceOrderSide,
    type: Exclude<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespACK> {
    const { options, symbol: _symbol } = await this.prepareOrder(
      symbol,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespACK>(
      "POST",
      "/api/v3/order",
      {
        symbol: _symbol,
        side,
        type,
        ...options,
      }
    );
  }

  /**
   * Test a new order with type other than MARKET or LIMIT order.
   *
   * Binance API will validates new order but will not send it into the matching
   * engine. Parameters are the same as `newOrderACK`.
   */
  async newOrderACKTest(
    symbol: string,
    side: BinanceOrderSide,
    type: Exclude<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespACK> {
    const { options, symbol: _symbol } = await this.prepareOrder(
      symbol,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespACK>(
      "POST",
      "/api/v3/order/test",
      {
        symbol: _symbol,
        side,
        type,
        ...options,
      }
    );
  }
}
