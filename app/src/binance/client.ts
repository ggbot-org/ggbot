import { div, mul } from "@ggbot2/arithmetic";
import {
  BinanceAccountInformation,
  BinanceBalance,
  BinanceKline,
  BinanceKlinesCacheMap,
  BinanceKlineInterval,
  binanceKlineIntervals,
  binanceKlineMaxLimit,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
  getBinanceIntervalTime,
} from "@ggbot2/binance";
import {
  BinanceDflowClient,
  BinanceDflowClientKlinesParameters,
  dflowBinanceLowerKlineInterval,
  dflowBinancePrecision,
  dflowBinanceZero as zero,
} from "@ggbot2/dflow";
import { Time } from "@ggbot2/time";

import {binance} from './exchange.js'

export class BinanceClient implements BinanceDflowClient {
  readonly balances: BinanceBalance[];
  readonly time: Time;
  private readonly klinesCache: BinanceKlinesCacheMap | undefined

  constructor({ balances, time }: Pick< BinanceClient, "balances" | "time"
>, klinesCache?: BinanceClient['klinesCache'] ) {
    this.balances = balances;
    this.time = time;
    this.klinesCache= klinesCache
  }

  async account() {
    const accountInfo: BinanceAccountInformation = {
      accountType: "SPOT",
      balances: this.balances,
      brokered: false,
      buyerCommission: 0,
      canDeposit: true,
      canTrade: true,
      canWithdraw: true,
      makerCommission: 15,
      permissions: ["SPOT"],
      sellerCommission: 0,
      takerCommission: 15,
      updateTime: 0,
    };
    return Promise.resolve(accountInfo);
  }

  async klines(
    symbol: string,
    interval: BinanceKlineInterval,
    { limit, endTime }: BinanceDflowClientKlinesParameters
  ) {
    // Look for cached data.
    const {klinesCache: cache}=this
    const cachedKlines: BinanceKline[] = [];
    let time = getBinanceIntervalTime[interval](endTime).minus(limit);
    while (time < endTime) {
      const kline = cache?.getKline(symbol, interval, time);
      if (!kline) break;
      cachedKlines.push(kline);
      time = getBinanceIntervalTime[interval](time).plus(1);
    }
    if (cachedKlines.length === limit) {
      return cachedKlines;
    }
    // If no data was found in cache, fetch it from Binance API.
    // Use maximum limit.
    const klines = await binance.klines(symbol, interval, {
      endTime,
      limit: binanceKlineMaxLimit,
    });
    // Cache all klines.
    if (cache) {
    for (const kline of klines) {
      cache.setKline(symbol, interval, kline);
    }
    }
    // Return only klines asked by limit parameter.
    return klines.slice(-limit);
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
      clientOrderId: "",
      cummulativeQuoteQty: zero,
      executedQty: quantity,
      orderId: -1,
      orderListId: -1,
      origQty: quantity,
      price,
      side,
      status: "FILLED",
      symbol,
      timeInForce: "GTC",
      transactTime: 0,
      type,

      fills: [
        {
          commission: zero,
          commissionAsset: "BNB",
          price,
          qty: quantity,
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
    // Look for cached data. Any binanceKlineInterval is acceptable to get price.
    for (const interval of binanceKlineIntervals) {
      const kline = binanceKlinesCacheMap.getKline(symbol, interval, time);
      if (kline)
        return {
          symbol,
          // Price is kline's open.
          price: kline[1],
        };
    }
    // If no data was found in cache, fetch it from Binance API.
    const interval = dflowBinanceLowerKlineInterval;
    const klines = await this.klines(symbol, interval, {
      limit: 1,
      endTime: time,
    });
    return {
      symbol,
      // Price is kline's close.
      price: klines[0][4],
    };
  }
}

