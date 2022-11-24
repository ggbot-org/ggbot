import type {
  BinanceKlineInterval,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import type { BinanceDflowClient } from "../client.js";
import { accountInfo } from "./accountInfo.js";
import { exchangeInfo } from "./exchangeInfo.js";
import { kline } from "./klines.js";

export class BinanceClientMock implements BinanceDflowClient {
  async account() {
    return Promise.resolve(accountInfo);
  }

  async tickerPrice(symbol: string) {
    return Promise.resolve({ symbol, price: "0" });
  }

  async candles(
    _symbol: string,
    _interval: BinanceKlineInterval,
    _limit: number
  ) {
    return [kline];
  }

  async exchangeInfo() {
    return Promise.resolve(exchangeInfo);
  }

  async isBinanceSymbol(arg: unknown) {
    if (typeof arg !== "string") return false;
    const { symbols } = await this.exchangeInfo();
    return symbols.findIndex(({ symbol }) => arg === symbol) !== -1;
  }

  async newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">
  ) {
    const zero = "0.00000000";
    const order: BinanceOrderRespFULL = {
      symbol,
      orderId: -1,
      orderListId: -1,
      clientOrderId: "",
      transactTime: 0,
      price: zero,
      origQty: zero,
      executedQty: zero,
      cummulativeQuoteQty: zero,
      status: "FILLED",
      timeInForce: "GTC",
      type,
      side,
      fills: [
        {
          price: zero,
          qty: zero,
          commission: zero,
          commissionAsset: "BNB",
          tradeId: -1,
        },
      ],
    };
    return Promise.resolve(order);
  }
}
