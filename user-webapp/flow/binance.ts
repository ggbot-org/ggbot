import {
  BinanceAccountInformation,
  BinanceBalance,
  BinanceConnector,
  BinanceExchange,
  BinanceKlineInterval,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import type { BinanceDflowClient as IBinanceDflowClient } from "@ggbot2/dflow";
import {
  Timestamp,
  getTimeFromTimestamp,
  now,
  truncateTimestamp,
} from "@ggbot2/time";

export const binance = new BinanceExchange({
  baseUrl: BinanceConnector.defaultBaseUrl,
});

export class BinanceDflowClient implements IBinanceDflowClient {
  balances: BinanceBalance[] = [];

  timestamp: Timestamp = truncateTimestamp(now()).to.hour();

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

  async candles(symbol: string, interval: BinanceKlineInterval, limit: number) {
    const startTime = getTimeFromTimestamp(this.timestamp);
    const klines = await binance.klines(symbol, interval, { startTime, limit });
    return klines;
  }

  async exchangeInfo() {
    return await binance.exchangeInfo();
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

  async isBinanceSymbol(arg: unknown) {
    return await binance.isBinanceSymbol(arg);
  }

  async tickerPrice(symbol: string) {
    // TODO cache data
    const data = await this.candles(symbol, "1h", 1);
    return Promise.resolve({ symbol, price: data[0][4] });
  }
}
