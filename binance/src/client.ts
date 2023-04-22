// TODO use "node:crypto"
import { createHmac } from "crypto";
import { BinanceConnectorRequestArg } from "./connector.js";
import { BinanceExchange, BinanceExchangeConstructorArg } from "./exchange.js";
import {
  BinanceAccountInformation,
  BinanceApiKeyPermission,
  BinanceNewOrderOptions,
  BinanceOrderRespACK,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "./types.js";
import { balanceIsNotEmpty } from "./utils.js";

/**
 * BinanceClient implements private API requests.
 * It extends BinanceExchange to be able to use also public API requests.
 */
export class BinanceClient extends BinanceExchange {
  apiKey: string;
  apiSecret: string;

  constructor({ apiKey, apiSecret, ...arg }: BinanceClientConstructorArg) {
    super(arg);
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async privateRequest<Data>(
    method: BinanceConnectorRequestArg["method"],
    endpoint: BinanceConnectorRequestArg["endpoint"],
    params?: BinanceConnectorRequestArg["params"]
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

    return await super.request<Data>({
      apiKey: this.apiKey,
      endpoint,
      method,
      params: Object.fromEntries(searchParams),
    });
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
    symbolInput: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL> {
    const { options, symbol } = await this.prepareOrder(
      symbolInput,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespFULL>(
      "POST",
      "/api/v3/order",
      {
        symbol,
        side,
        type,
        ...options,
      }
    );
  }

  /**
   * Test a new order.
   *
   * Binance API will validate new order but will not send it into the matching engine.
   * Parameters are the same as `newOrder`.
   */
  async newOrderTest(
    symbolInput: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL> {
    const { options, symbol } = await this.prepareOrder(
      symbolInput,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespFULL>(
      "POST",
      "/api/v3/order/test",
      {
        symbol,
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
    symbolInput: string,
    side: BinanceOrderSide,
    type: Exclude<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespACK> {
    const { options, symbol } = await this.prepareOrder(
      symbolInput,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespACK>(
      "POST",
      "/api/v3/order",
      {
        symbol,
        side,
        type,
        ...options,
      }
    );
  }

  /**
   * Test a new order with type other than MARKET or LIMIT order.
   *
   * Binance API will validates new order but will not send it into the matching engine.
   * Parameters are the same as `newOrderACK`.
   */
  async newOrderACKTest(
    symbolInput: string,
    side: BinanceOrderSide,
    type: Exclude<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespACK> {
    const { options, symbol } = await this.prepareOrder(
      symbolInput,
      side,
      type,
      orderOptions
    );
    return await this.privateRequest<BinanceOrderRespACK>(
      "POST",
      "/api/v3/order/test",
      {
        symbol,
        side,
        type,
        ...options,
      }
    );
  }
}

export type BinanceClientConstructorArg = BinanceExchangeConstructorArg &
  Pick<BinanceClient, "apiKey" | "apiSecret">;
