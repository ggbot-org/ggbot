import {
  BinanceAccountInformation,
  BinanceExchangeInfo,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
  BinanceTickerPrice,
} from "@ggbot2/binance";
import { DflowCommonContext } from "../common/context.js";

export interface Binance {
  // Public API
  // //////////////////////////////////////////////////////////////////

  tickerPrice(symbol: string): Promise<BinanceTickerPrice>;
  exchangeInfo(): Promise<BinanceExchangeInfo>;

  // Private API
  // //////////////////////////////////////////////////////////////////

  account(): Promise<BinanceAccountInformation>;
  newOrder(
    symbol: unknown,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL>;
}

export type BinanceDflowContext = DflowCommonContext & {
  binance: Binance;
};
