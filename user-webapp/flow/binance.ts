import { div, mul } from "@ggbot2/arithmetic";
import {
  BinanceAccountInformation,
  BinanceBalance,
  BinanceCacheMap,
  BinanceConnector,
  BinanceExchange,
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import {
  BinanceDflowClient as IBinanceDflowClient,
  dflowBinanceZero as zero,
  dflowBinancePrecision,
} from "@ggbot2/dflow";
import type { Time } from "@ggbot2/time";

export const binance = new BinanceExchange({
  baseUrl: BinanceConnector.defaultBaseUrl,
  cache: new BinanceCacheMap(),
});

export class BinanceDflowClient implements IBinanceDflowClient {
  readonly balances: BinanceBalance[];
  readonly time: Time;

  constructor({ balances, time }: BinanceDflowClientArg) {
    this.balances = balances;
    this.time = time;
  }

  async account() {
    const accountInfo: BinanceAccountInformation = {
      makerCommission: 15,
      takerCommission: 15,
      buyerCommission: 0,
      sellerCommission: 0,
      canTrade: true,
      canWithdraw: true,
      canDeposit: true,
      brokered: false,
      updateTime: 0,
      accountType: "SPOT",
      balances: this.balances,
      permissions: ["SPOT"],
    };
    return Promise.resolve(accountInfo);
  }

  async klines(
    symbol: string,
    interval: BinanceKlineInterval,
    optionalParameters: BinanceKlineOptionalParameters
  ) {
    const klines = await binance.klines(symbol, interval, optionalParameters);
    return klines;
  }

  async exchangeInfo() {
    return await binance.exchangeInfo();
  }

  async newOrder(
    symbolInput: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ) {
    const { options, symbol } = await binance.prepareOrder(
      symbolInput,
      side,
      type,
      orderOptions
    );
    const { price } = await this.tickerPrice(symbol);
    let quantity = zero;
    let quoteQuantity = zero;
    if (options.quantity !== undefined) {
      quantity = options.quantity;
      quoteQuantity = mul(quantity, price, dflowBinancePrecision);
    }
    if (options.quoteOrderQty !== undefined) {
      quoteQuantity = options.quoteOrderQty;
      quantity = div(quoteQuantity, price, dflowBinancePrecision);
    }

    const order: BinanceOrderRespFULL = {
      symbol,
      orderId: -1,
      orderListId: -1,
      clientOrderId: "",
      transactTime: 0,
      price,
      origQty: quantity,
      executedQty: quantity,
      cummulativeQuoteQty: zero,
      status: "FILLED",
      timeInForce: "GTC",
      type,
      side,
      fills: [
        {
          price,
          qty: quantity,
          commission: zero,
          commissionAsset: "BNB",
          tradeId: -1,
        },
      ],
    };
    return Promise.resolve(order);
  }

  async isBinanceSymbol(arg: unknown) {
    return await binance.isBinanceSymbol(arg);
  }

  async tickerPrice(symbol: string) {
    const klines = await binance.klines(symbol, "1m", {
      startTime: this.time,
      limit: 2,
    });
    const price = klines[0][4];
    return Promise.resolve({ symbol, price });
  }
}

export type BinanceDflowClientArg = Pick<
  BinanceDflowClient,
  "balances" | "time"
>;
