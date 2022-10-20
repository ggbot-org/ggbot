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

export interface BinanceDflow {
  // Public API
  // //////////////////////////////////////////////////////////////////

  candles(
    symbol: string,
    interval: BinanceKlineInterval,
    limit: number
  ): Promise<BinanceKline[]>;
  exchangeInfo(): Promise<BinanceExchangeInfo>;
  isBinanceSymbol(arg: unknown): Promise<boolean>;
  tickerPrice(symbol: string): Promise<BinanceTickerPrice>;

  // Private API
  // //////////////////////////////////////////////////////////////////

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

export type BinanceDflowContext = DflowCommonContext & {
  binance: BinanceDflow;
};
