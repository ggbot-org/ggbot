import { div, mul } from "@ggbot2/arithmetic";
import {
  BinanceAccountInformation,
  binanceApiDomain,
  BinanceBalance,
  BinanceCacheMap,
  BinanceExchange,
  BinanceKlineInterval,
  binanceKlineIntervals,
  BinanceKlineOptionalParameters,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import {
  BinanceDflowClient as IBinanceDflowClient,
  dflowBinanceLowerKlineInterval,
  dflowBinancePrecision,
  dflowBinanceZero as zero,
} from "@ggbot2/dflow";
import { Time } from "@ggbot2/time";

const cache = new BinanceCacheMap();

export const binance = new BinanceExchange({
  baseUrl: `https://${binanceApiDomain}`,
  cache,
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
    const { time } = this;
    // Look for cached data.
    for (const interval of binanceKlineIntervals) {
      const key = BinanceCacheMap.klinesKey(symbol, interval, time);
      const kline = cache.klinesMap.get(key);
      if (kline) {
        const price = kline[4];
        return Promise.resolve({ symbol, price });
      }
    }
    // If no data was found in cache, fetch it from Binance API.
    const klines = await binance.klines(
      symbol,
      dflowBinanceLowerKlineInterval,
      {
        startTime: time,
        limit: 1,
      }
    );
    const price = klines[0][4];
    return Promise.resolve({ symbol, price });
  }
}

export type BinanceDflowClientArg = Pick<
  BinanceDflowClient,
  "balances" | "time"
>;
