import { div, mul } from "@ggbot2/arithmetic";
import {
  BinanceAccountInformation,
  BinanceBalance,
  BinanceCacheMap,
  BinanceCacheProvider,
  BinanceExchange,
  BinanceExchangeInfo,
  BinanceKline,
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
import { CacheMap } from "@ggbot2/models";
import { Time, TimeInterval } from "@ggbot2/time";
import { sessionWebStorage } from "@ggbot2/web-storage";

class BinanceCacheSessionWebStorage implements BinanceCacheProvider {
  // BinanceExchangeInfoCacheProvider
  // ///////////////////////////////////////////////////////////////////////////

  getExchangeInfo(): BinanceExchangeInfo | undefined {
    return sessionWebStorage.binanceExchangeInfo;
  }

  setExchangeInfo(arg: BinanceExchangeInfo): void {
    sessionWebStorage.binanceExchangeInfo = arg;
  }

  // BinanceIsValidSymbolCacheProvider
  // ///////////////////////////////////////////////////////////////////////////

  readonly isValidSymbolMap = new CacheMap<boolean>();

  getIsValidSymbol(symbol: string) {
    return this.isValidSymbolMap.get(symbol);
  }

  setIsValidSymbol(symbol: string, value: boolean) {
    this.isValidSymbolMap.set(symbol, value);
  }

  // BinanceKlineCacheProvider
  // ///////////////////////////////////////////////////////////////////////////

  getKlines(
    _symbol: string,
    _interval: BinanceKlineInterval,
    _timeInterval: TimeInterval
  ): BinanceKline[] | undefined {
    return;
  }

  setKlines(
    _symbol: string,
    _interval: BinanceKlineInterval,
    _klines: BinanceKline[]
  ): void {}
}

export const binance = new BinanceExchange();
binance.cache = new BinanceCacheSessionWebStorage();

const cacheMap = new BinanceCacheMap();

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
    // Look for cached data.
    for (const interval of binanceKlineIntervals) {
      const key = BinanceCacheMap.klinesKey(symbol, interval, time);
      const kline = cacheMap.klinesMap.get(key);
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
        limit: 1,
        startTime: time,
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
