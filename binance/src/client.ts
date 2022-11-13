import { mul } from "@ggbot2/arithmetic";
import { createHmac } from "crypto";
import { BinanceConnectorRequestArg } from "./connector.js";
import {
  ErrorBinanceCannotTradeSymbol,
  ErrorInvalidBinanceOrderOptions,
  ErrorInvalidBinanceOrderSide,
  ErrorInvalidBinanceOrderType,
  ErrorUnhandledBinanceOrderType,
} from "./errors.js";
import { BinanceExchange, BinanceExchangeConstructorArg } from "./exchange.js";
import {
  findSymbolFilterLotSize,
  findSymbolFilterMinNotional,
  lotSizeIsValid,
  minNotionalIsValid,
} from "./symbolFilters.js";
import type {
  BinanceAccountInformation,
  BinanceApiKeyPermission,
  BinanceNewOrderOptions,
  BinanceOrderRespACK,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "./types.js";
import { isBinanceOrderSide, isBinanceOrderType } from "./typeGuards.js";

/** BinanceClient implements private API requests.
It extends BinanceExchange to be able to use also some public API requests.
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
Account Information (USER_DATA)

{@link https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data}
*/
  async account(): Promise<BinanceAccountInformation> {
    const { balances, ...rest } =
      await this.privateRequest<BinanceAccountInformation>(
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
Send in a new order.

{@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
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
Test a new order.
Binance API will validates new order but will not send it into the matching engine.

Parameters are the same as `newOrder`.
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
Send in a new order with type other than MARKET or LIMIT order.

{@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
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
Test a new order with type other than MARKET or LIMIT order.
Binance API will validates new order but will not send it into the matching engine.

Parameters are the same as `newOrderACK`.
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
Validate order parameters and try to adjust them; otherwise throw an error.

@see {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}

@throws {ErrorBinanceCannotTradeSymbol}
@throws {ErrorInvalidBinanceOrderOptions}
@throws {ErrorInvalidBinanceOrderSide}
@throws {ErrorInvalidBinanceOrderType}
@throws {ErrorInvalidBinanceSymbol}
@throws {ErrorUnhandledBinanceOrderType}
*/
  async prepareOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: BinanceOrderType,
    orderOptions: BinanceNewOrderOptions
  ): Promise<{ options: BinanceNewOrderOptions; symbol: string }> {
    if (!isBinanceOrderSide(side)) throw new ErrorInvalidBinanceOrderSide(side);
    if (!isBinanceOrderType(type)) throw new ErrorInvalidBinanceOrderType(type);
    const symbolInfo = await this.symbolInfo(symbol);
    if (!symbolInfo || !this.canTradeSymbol(symbol, type))
      throw new ErrorBinanceCannotTradeSymbol(symbol, type);

    const { baseAssetPrecision, filters } = symbolInfo;

    const lotSizeFilter = findSymbolFilterLotSize(filters);
    const minNotionalFilter = findSymbolFilterMinNotional(filters);

    const {
      price,
      quantity,
      quoteOrderQty,
      stopPrice,
      timeInForce,
      trailingDelta,
    } = orderOptions;

    switch (type) {
      case "LIMIT": {
        if (
          typeof price === "undefined" ||
          typeof quoteOrderQty === "undefined" ||
          typeof timeInForce === "undefined"
        )
          throw new ErrorInvalidBinanceOrderOptions();
        throw new ErrorUnhandledBinanceOrderType(type);
      }

      case "LIMIT_MAKER": {
        if (typeof quantity === "undefined" || typeof price === "undefined")
          throw new ErrorInvalidBinanceOrderOptions();
        throw new ErrorUnhandledBinanceOrderType(type);
      }

      case "MARKET": {
        const { price, mins } = await this.avgPrice(symbol);

        if (typeof quantity === "undefined") {
          if (typeof quoteOrderQty === "undefined")
            throw new ErrorInvalidBinanceOrderOptions();

          const computedQuantity = mul(
            price,
            quoteOrderQty,
            baseAssetPrecision
          );

          if (
            minNotionalFilter &&
            minNotionalFilter.applyToMarket &&
            minNotionalFilter.avgPriceMins === mins &&
            !minNotionalIsValid(minNotionalFilter, computedQuantity)
          )
            throw new ErrorInvalidBinanceOrderOptions();
        } else {
          if (lotSizeFilter && !lotSizeIsValid(lotSizeFilter, quantity))
            throw new ErrorInvalidBinanceOrderOptions();
        }

        return { options: orderOptions, symbol };
      }

      case "STOP_LOSS": {
        if (
          typeof quantity === "undefined" ||
          (typeof stopPrice === "undefined" &&
            typeof trailingDelta === "undefined")
        )
          throw new ErrorInvalidBinanceOrderOptions();
        throw new ErrorUnhandledBinanceOrderType(type);
      }

      case "STOP_LOSS_LIMIT": {
        if (
          typeof timeInForce === "undefined" ||
          typeof quantity === "undefined" ||
          typeof price === "undefined" ||
          (typeof stopPrice === "undefined" &&
            typeof trailingDelta === "undefined")
        )
          throw new ErrorInvalidBinanceOrderOptions();
        throw new ErrorUnhandledBinanceOrderType(type);
      }

      case "TAKE_PROFIT": {
        if (
          typeof quantity === "undefined" ||
          (typeof stopPrice === "undefined" &&
            typeof trailingDelta === "undefined")
        )
          throw new ErrorInvalidBinanceOrderOptions();
        throw new ErrorUnhandledBinanceOrderType(type);
      }

      case "TAKE_PROFIT_LIMIT": {
        if (
          typeof timeInForce === "undefined" ||
          typeof quantity === "undefined" ||
          typeof price === "undefined" ||
          (typeof stopPrice === "undefined" &&
            typeof trailingDelta === "undefined")
        )
          throw new ErrorInvalidBinanceOrderOptions();
        throw new ErrorUnhandledBinanceOrderType(type);
      }

      default:
        throw new ErrorUnhandledBinanceOrderType(type);
    }
  }
}

export type BinanceClientConstructorArg = BinanceExchangeConstructorArg &
  Pick<BinanceClient, "apiKey" | "apiSecret">;
