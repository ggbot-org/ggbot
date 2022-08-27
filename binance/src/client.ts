import { createHmac } from "crypto";
import {
  BinanceConnectorConstructorArg,
  BinanceConnectorRequestArg,
} from "./connector.js";
import {
  ErrorBinanceCannotTradeSymbol,
  ErrorInvalidBinanceOrderOptions,
  ErrorInvalidBinanceOrderSide,
  ErrorInvalidBinanceOrderType,
} from "./errors.js";
import { BinanceExchange } from "./exchange.js";
import {
  BinanceAccountInformation,
  BinanceApiKeyPermission,
  BinanceNewOrderOptions,
  BinanceOrderRespACK,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
  isBinanceOrderSide,
  isBinanceOrderType,
} from "./types.js";

/**
 * BinanceClient implements private API requests.
 * It extends BinanceExchange to be able to use also some public API requests.
 */
export class BinanceClient extends BinanceExchange {
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

  /**
   * Account Information (USER_DATA)
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data}
   */
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

  /**
   * Send in a new MARKET or LIMIT order.
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
   */
  async newOrder(
    symbolInput: unknown,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL> {
    const { options, symbol } = await this.prepareOrder(
      symbolInput,
      side,
      type,
      orderOptions
    );
    return await this._privateRequest<BinanceOrderRespFULL>(
      "GET",
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
   * Test a new MARKET or LIMIT order.
   * Binance API will validates new order but will not send it into the matching engine.
   *
   * Parameters are the same as `newOrder`.
   */
  async newOrderTest(
    symbolInput: unknown,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL> {
    const { options, symbol } = await this.prepareOrder(
      symbolInput,
      side,
      type,
      orderOptions
    );
    return await this._privateRequest<BinanceOrderRespFULL>(
      "GET",
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
   * {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
   */
  async newOrderACK(
    symbolInput: unknown,
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
    return await this._privateRequest<BinanceOrderRespACK>(
      "GET",
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
   * Binance API will validates new order but will not send it into the matching engine.
   *
   * Parameters are the same as `newOrderACK`.
   */
  async newOrderACKTest(
    symbolInput: unknown,
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
    return await this._privateRequest<BinanceOrderRespACK>(
      "GET",
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
   * Validate order parameters and try to adjust them; otherwise it throws an error.
   *
   * @throws ErrorBinanceCannotTradeSymbol
   * @throws ErrorInvalidBinanceOrderOptions
   * @throws ErrorInvalidBinanceOrderSide
   * @throws ErrorInvalidBinanceOrderType
   * @throws ErrorInvalidBinanceSymbol
   */
  async prepareOrder(
    symbolInput: unknown,
    side: BinanceOrderSide,
    type: BinanceOrderType,
    orderOptions: BinanceNewOrderOptions
  ): Promise<{ options: BinanceNewOrderOptions; symbol: string }> {
    if (!isBinanceOrderSide(side)) throw new ErrorInvalidBinanceOrderSide(side);
    if (!isBinanceOrderType(type)) throw new ErrorInvalidBinanceOrderType(type);
    if (!this.canTradeSymbol(symbolInput, type))
      throw new ErrorBinanceCannotTradeSymbol(symbolInput, type);

    const symbolInfo = await this.symbolInfo(symbolInput);
    const options = BinanceExchange.filterOrderOptions(
      symbolInfo,
      orderOptions
    );
    if (!options) throw new ErrorInvalidBinanceOrderOptions();
    return { options, symbol: symbolInfo.symbol };
  }
}

export type BinanceClientConstructorArg = BinanceConnectorConstructorArg &
  Pick<BinanceClient, "apiKey" | "apiSecret">;
