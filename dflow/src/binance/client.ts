import {
  BinanceAccountInformation,
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

/** Binance API used by dflow binance nodes. */
export interface BinanceDflowClient
  extends BinanceDflowClientPublic,
    BinanceDflowClientPrivate {}

export type BinanceDflowClientKlinesParameters = Required<
  Pick<BinanceKlineOptionalParameters, "endTime" | "limit">
>;

/** Binance Public API used by dflow binance nodes. */
interface BinanceDflowClientPublic {
  exchangeInfo(): Promise<BinanceExchangeInfo>;
  isBinanceSymbol(arg: unknown): Promise<boolean>;
  klines(
    symbol: string,
    interval: BinanceKlineInterval,
    parameters: BinanceDflowClientKlinesParameters
  ): Promise<BinanceKline[]>;
  tickerPrice(symbol: string): Promise<BinanceTickerPrice>;
}

/** Binance Private API used by dflow binance nodes. */
interface BinanceDflowClientPrivate {
  account(): Promise<BinanceAccountInformation>;
  newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL>;
}
