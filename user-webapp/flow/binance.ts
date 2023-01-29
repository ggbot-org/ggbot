import { div, mul } from "@ggbot2/arithmetic";
import {
  BinanceAccountInformation,
  BinanceBalance,
  BinanceCacheMap,
  BinanceCacheProvider,
  BinanceConnector,
  BinanceExchange,
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
  getBinanceIntervalTime,
  isBinanceKline,
} from "@ggbot2/binance";
import {
  BinanceDflowClient as IBinanceDflowClient,
  dflowBinanceZero as zero,
  dflowBinancePrecision,
  dflowBinanceLowerKlineInterval,
} from "@ggbot2/dflow";
import { Time, TimeInterval } from "@ggbot2/time";

/**
 * Cache klines in WebStorage.
 */
class BinanceCacheWebstorage implements BinanceCacheProvider {
  private cacheMap = new BinanceCacheMap();

  // BinanceExchangeInfoCacheProvider
  getExchangeInfo() {
    return this.cacheMap.getExchangeInfo();
  }
  setExchangeInfo(value: BinanceExchangeInfo | undefined) {
    if (value) this.cacheMap.setExchangeInfo(value);
  }

  // BinanceIsValidSymbolCacheProvider
  getIsValidSymbol(symbol: string) {
    return this.cacheMap.getIsValidSymbol(symbol);
  }
  setIsValidSymbol(symbol: string, value: boolean) {
    this.cacheMap.setIsValidSymbol(symbol, value);
  }

  // BinanceKlineCacheProvider
  getKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    timeInterval: TimeInterval
  ) {
    const klines: BinanceKline[] = [];
    let openTime = timeInterval.start;
    while (openTime < timeInterval.end) {
      const key = BinanceCacheMap.klinesKey(symbol, interval, openTime);
      const cachedKline = global?.window?.sessionStorage.getItem(key);
      if (!cachedKline) return;
      const kline = JSON.parse(cachedKline);
      if (!isBinanceKline(kline)) return;
      klines.push(kline);
      openTime = getBinanceIntervalTime[interval](openTime).plus(1);
    }
    return klines;
  }
  setKlines(
    symbol: string,
    interval: BinanceKlineInterval,
    klines: BinanceKline[]
  ) {
    for (const kline of klines) {
      const openTime = kline[0];
      const key = BinanceCacheMap.klinesKey(symbol, interval, openTime);
      global?.window?.sessionStorage.setItem(key, JSON.stringify(kline));
    }
  }
}

export const binance = new BinanceExchange({
  baseUrl: BinanceConnector.defaultBaseUrl,
  cache: new BinanceCacheWebstorage(),
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
    const klines = await binance.klines(
      symbol,
      dflowBinanceLowerKlineInterval,
      {
        startTime: this.time,
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
