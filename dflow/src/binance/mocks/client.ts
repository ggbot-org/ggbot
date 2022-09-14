import {
  BinanceExchangeInfo,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import { Binance } from "../context.js";
import exchangeInfo from "./exchangeInfo.json";

export class BinanceClientMock implements Binance {
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
      balances: [],
      permissions: ["SPOT"],
    });
  }

  async avgPrice(_symbol: unknown) {
    return Promise.resolve({ mins: 5, price: "0" });
  }

  async exchangeInfo() {
    const data = exchangeInfo as unknown as BinanceExchangeInfo;
    return Promise.resolve(data);
  }

  async newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "LIMIT" | "MARKET">
  ) {
    const orderResp: BinanceOrderRespFULL = {
      symbol,
      orderId: 5825035597,
      orderListId: -1,
      clientOrderId: "R35e9hBjkwGc3nYqrQprM9",
      transactTime: 1661548999130,
      price: "0.00000000",
      origQty: "0.00096000",
      executedQty: "0.00096000",
      cummulativeQuoteQty: "19.82358720",
      status: "FILLED",
      timeInForce: "GTC",
      type,
      side,
      fills: [
        {
          price: "20649.57000000",
          qty: "0.00096000",
          commission: "0.00000000",
          commissionAsset: "BNB",
          tradeId: 446242989,
        },
      ],
    };
    return Promise.resolve(orderResp);
  }
}
