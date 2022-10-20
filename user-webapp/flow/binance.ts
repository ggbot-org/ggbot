import {
  BinanceBalance,
  BinanceConnector,
  BinanceExchange,
  BinanceKlineInterval,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import type { BinanceDflow as IBinanceDflow } from "@ggbot2/dflow";
import { Timestamp, truncateTimestamp } from "@ggbot2/time";

export const binance = new BinanceExchange({
  baseUrl: BinanceConnector.defaultBaseUrl,
});

export class BinanceDflow implements IBinanceDflow {
  balances: BinanceBalance[] = [];

  timestamp: Timestamp = truncateTimestamp().to("hour");

  async account() {
    return Promise.resolve({
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
    });
  }

  async candles(
    _symbol: string,
    _interval: BinanceKlineInterval,
    _limit: number
  ) {
    // TODO call binance.klines with proper startTime according to timestamp
    // TODO cache results
    // TODO fetch strategy: partition intervals in days
    return Promise.resolve([]);
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
