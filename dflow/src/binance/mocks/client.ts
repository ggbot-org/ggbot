import {
  BinanceAccountInformation,
  BinanceExchangeInfo,
  BinanceKline,
  BinanceKlineInterval,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import { BinanceDflow } from "../context.js";
import { accountInfo } from "./accountInfo.js";
import { exchangeInfo } from "./exchangeInfo.js";

export class BinanceClientMock implements BinanceDflow {
  async account() {
    return Promise.resolve(accountInfo as unknown as BinanceAccountInformation);
  }

  async tickerPrice(symbol: string) {
    return Promise.resolve({ symbol, price: "0" });
  }

  async candles(
    _symbol: string,
    _interval: BinanceKlineInterval,
    _limit: number
  ): Promise<BinanceKline[]> {
    return [];
  }

  async exchangeInfo() {
    return Promise.resolve(exchangeInfo as unknown as BinanceExchangeInfo);
  }

  async isBinanceSymbol(arg: unknown): Promise<boolean> {
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
    return Promise.resolve({
      symbol,
      price: zero,
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
    });
  }
}
