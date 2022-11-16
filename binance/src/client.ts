import { mul } from "@ggbot2/arithmetic";
import { createHmac } from "crypto";
import { BinanceConnectorRequestArg } from "./connector.js";
import {
  ErrorBinanceCannotTradeSymbol,
  ErrorBinanceInvalidArg,
  ErrorBinanceInvalidOrderOptions,
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
It extends BinanceExchange to be able to use also some public API requests. */
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
@throws {ErrorBinanceInvalidArg}
*/
  async prepareOrder(
    symbol: string,
    side: BinanceOrderSide,
    orderType: BinanceOrderType,
    orderOptions: BinanceNewOrderOptions
  ): Promise<{ options: BinanceNewOrderOptions; symbol: string }> {
    if (!isBinanceOrderSide(side))
      throw new ErrorBinanceInvalidArg({ arg: side, type: "orderSide" });
    if (!isBinanceOrderType(orderType))
      throw new ErrorBinanceInvalidArg({
        arg: orderType,
        type: "orderType",
      });
    const symbolInfo = await this.symbolInfo(symbol);
    if (!symbolInfo || !this.canTradeSymbol(symbol, orderType))
      throw new ErrorBinanceCannotTradeSymbol({ symbol, orderType });

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

    const prepareOptions: Record<
      BinanceOrderType,
      () => Promise<BinanceNewOrderOptions>
    > = {
      LIMIT: async () => {
        if (
          price === undefined ||
          quoteOrderQty === undefined ||
          timeInForce === undefined
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
      LIMIT_MAKER: async () => {
        if (quantity === undefined || price === undefined)
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
      MARKET: async () => {
        if (quantity) {
          if (lotSizeFilter && !lotSizeIsValid(lotSizeFilter, quantity))
            throw new ErrorBinanceInvalidOrderOptions();
          return orderOptions;
        }

        if (quoteOrderQty === undefined)
          throw new ErrorBinanceInvalidOrderOptions();

        const { price, mins } = await this.avgPrice(symbol);

        const computedQuantity = mul(price, quoteOrderQty, baseAssetPrecision);

        if (
          minNotionalFilter &&
          minNotionalFilter.applyToMarket &&
          minNotionalFilter.avgPriceMins === mins &&
          !minNotionalIsValid(minNotionalFilter, computedQuantity)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
      STOP_LOSS: async () => {
        if (
          quantity === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
      STOP_LOSS_LIMIT: async () => {
        if (
          timeInForce === undefined ||
          quantity === undefined ||
          price === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
      TAKE_PROFIT: async () => {
        if (
          quantity === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
      TAKE_PROFIT_LIMIT: async () => {
        if (
          timeInForce === undefined ||
          quantity === undefined ||
          price === undefined ||
          (stopPrice === undefined && trailingDelta === undefined)
        )
          throw new ErrorBinanceInvalidOrderOptions();
        return orderOptions;
      },
    };

    const options = await prepareOptions[orderType]();
    return { symbol, options };
  }
}

export type BinanceClientConstructorArg = BinanceExchangeConstructorArg &
  Pick<BinanceClient, "apiKey" | "apiSecret">;
