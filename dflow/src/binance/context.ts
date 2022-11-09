import {
  BinanceAccountInformation,
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
  BinanceTickerPrice,
} from "@ggbot2/binance";
import { DflowCommonContext } from "../common/context.js";

/**
Binance Public API used by dflow binance nodes.
*/
interface BinanceDflowClientPublic {
  candles(
    symbol: string,
    interval: BinanceKlineInterval,
    limit: number
  ): Promise<BinanceKline[]>;
  exchangeInfo(): Promise<BinanceExchangeInfo>;
  isBinanceSymbol(arg: unknown): Promise<boolean>;
  tickerPrice(symbol: string): Promise<BinanceTickerPrice>;
}

/**
Binance Private API used by dflow binance nodes.
*/
interface BinanceDflowClientPrivate {
  account(): Promise<BinanceAccountInformation>;
  newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<
    Omit<
      BinanceOrderRespFULL,
      | "clientOrderId"
      | "cummulativeQuoteQty"
      | "executedQty"
      | "orderId"
      | "orderListId"
      | "origQty"
      | "status"
      | "timeInForce"
      | "transactTime"
    >
  >;
}

/**
Binance API used by dflow binance nodes.
*/
export interface BinanceDflowClient
  extends BinanceDflowClientPublic,
    BinanceDflowClientPrivate {}

export type BinanceDflowContext = DflowCommonContext & {
  binance: BinanceDflowClient;
};
