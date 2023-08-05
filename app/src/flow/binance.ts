import { div, mul } from "@ggbot2/arithmetic";
import {
  BinanceAccountInformation,
  BinanceBalance,
  BinanceExchange,
  BinanceExchangeInfo,
  BinanceExchangeInfoCacheProvider,
  BinanceKline,
  BinanceKlineCacheProvider,
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
  BinanceDflowClient as IBinanceDflowClient,
  BinanceDflowClientKlinesParameters,
  dflowBinanceLowerKlineInterval,
  dflowBinancePrecision,
  dflowBinanceZero as zero,
} from "@ggbot2/dflow";
import { CacheMap } from "@ggbot2/models";
import { Time } from "@ggbot2/time";
import { sessionWebStorage } from "@ggbot2/web-storage";

class BinanceCacheSessionWebStorage
  implements BinanceExchangeInfoCacheProvider
{
  readonly isValidSymbolMap = new CacheMap<boolean>();

  getExchangeInfo(): BinanceExchangeInfo | undefined {
    return sessionWebStorage.binanceExchangeInfo;
  }

  setExchangeInfo(arg: BinanceExchangeInfo): void {
    sessionWebStorage.binanceExchangeInfo = arg;
  }

  getIsValidSymbol(symbol: string) {
    return this.isValidSymbolMap.get(symbol);
  }

  setIsValidSymbol(symbol: string, value: boolean) {
    this.isValidSymbolMap.set(symbol, value);
  }
}

export const binance = new BinanceExchange();
binance.exchangeInfoCache = new BinanceCacheSessionWebStorage();

// TODO move it into binance package and reuse it in Executor
class BinanceKlinesCacheMap implements BinanceKlineCacheProvider {
  static klineKey(
    symbol: string,
    interval: BinanceKlineInterval,
    /* THe kline open time. */
    time: Time
  ) {
    return [symbol, interval, time].join(":");
  }

  private readonly klinesMap = new CacheMap<BinanceKline>("ONE_WEEK");

  getKline(
    symbol: string,
    interval: BinanceKlineInterval,
    time: Time
  ): BinanceKline | undefined {
    const key = BinanceKlinesCacheMap.klineKey(symbol, interval, time);
    const kline = this.klinesMap.get(key);
    return kline;
  }

  setKline(
    symbol: string,
    interval: BinanceKlineInterval,
    kline: BinanceKline
  ): void {
    const key = BinanceKlinesCacheMap.klineKey(symbol, interval, kline[0]);
    this.klinesMap.set(key, kline);
  }
}

const binanceKlinesCacheMap = new BinanceKlinesCacheMap();

export class BinanceDflowClient implements IBinanceDflowClient {
  readonly balances: BinanceBalance[];
  readonly time: Time;

  constructor({ balances, time }: BinanceDflowClientArg) {
    this.balances = balances;
    this.time = time;
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
    const cachedKlines: BinanceKline[] = [];
    let time = getBinanceIntervalTime[interval](endTime).minus(limit);
    while (time < endTime) {
      const kline = binanceKlinesCacheMap.getKline(symbol, interval, time);
      time = getBinanceIntervalTime[interval](time).plus(1);
      if (!kline) break;
      cachedKlines.push(kline);
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
    for (const kline of klines) {
      binanceKlinesCacheMap.setKline(symbol, interval, kline);
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
      if (kline) {
        const price = kline[4];
        return Promise.resolve({ symbol, price });
      }
    }
    // If no data was found in cache, fetch it from Binance API.
    const interval = dflowBinanceLowerKlineInterval;
    const klines = await binance.klines(symbol, interval, {
      limit: 1,
      startTime: time,
    });
    const price = klines[0][4];
    return Promise.resolve({ symbol, price });
  }
}

export type BinanceDflowClientArg = Pick<
  BinanceDflowClient,
  "balances" | "time"
>;
