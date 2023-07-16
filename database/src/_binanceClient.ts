import {
  BinanceAccountInformation,
  BinanceCacheMap,
  BinanceExchange,
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
  BinanceTickerPrice,
} from "@ggbot2/binance";
import { BinanceClient } from "@ggbot2/binance-client";
import { BinanceDflowClient } from "@ggbot2/dflow";
import { binanceProxyDomain } from "@ggbot2/locators";

/** A Binance client that uses a proxy for private requests. */
export class _BinanceClient implements BinanceDflowClient {
  readonly privateClient: BinanceClient;
  readonly publicClient: BinanceExchange;

  constructor(apiKey: string, apiSecret: string) {
    this.publicClient = new BinanceExchange();
    this.publicClient.cache = new BinanceCacheMap();
    this.privateClient = new BinanceClient(
      apiKey,
      apiSecret,
      `https://${binanceProxyDomain}`
    );
  }

  async account(): Promise<BinanceAccountInformation> {
    return await this.privateClient.account();
  }

  async candles(
    symbol: string,
    interval: BinanceKlineInterval,
    limit: number
  ): Promise<BinanceKline[]> {
    return await this.publicClient.klines(symbol, interval, { limit });
  }

  async exchangeInfo(): Promise<BinanceExchangeInfo> {
    return await this.publicClient.exchangeInfo();
  }

  async isBinanceSymbol(arg: unknown): Promise<boolean> {
    return await this.publicClient.isBinanceSymbol(arg);
  }

  async klines(
    symbol: string,
    interval: BinanceKlineInterval,
    optionalParameters: BinanceKlineOptionalParameters
  ): Promise<BinanceKline[]> {
    return await this.publicClient.klines(symbol, interval, optionalParameters);
  }

  async newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL> {
    return this.privateClient.newOrder(symbol, side, type, orderOptions);
  }

  async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
    return this.publicClient.tickerPrice(symbol);
  }
}
