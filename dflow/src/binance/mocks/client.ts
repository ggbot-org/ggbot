/* eslint-disable sort-keys */
import {
  BinanceKlineInterval,
  BinanceKlineOptionalParameters,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";

import { BinanceDflowClient } from "../client.js";
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

  async exchangeInfo() {
    return Promise.resolve(exchangeInfo);
  }

  async isBinanceSymbol(arg: unknown) {
    if (typeof arg !== "string") return false;
    const { symbols } = await this.exchangeInfo();
    return symbols.findIndex(({ symbol }) => arg === symbol) !== -1;
  }

  async klines(
    _symbol: string,
    _interval: BinanceKlineInterval,
    _optionalParameters: BinanceKlineOptionalParameters
  ) {
    return [kline];
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
