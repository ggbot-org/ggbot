import {
  BinanceAccountInformation,
  BinanceAvgPrice,
  BinanceExchangeInfo,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import { DflowCommonContext } from "../common/context.js";

export interface Binance {
  // Public API
  // //////////////////////////////////////////////////////////////////

  avgPrice(symbol: unknown): Promise<BinanceAvgPrice>;
  exchangeInfo(): Promise<BinanceExchangeInfo>;

  // Private API
  // //////////////////////////////////////////////////////////////////

  account(): Promise<BinanceAccountInformation>;
  newOrder(
    symbol: unknown,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "LIMIT" | "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ): Promise<BinanceOrderRespFULL>;
}

export type BinanceDflowContext = DflowCommonContext & {
  binance: Binance;
};
