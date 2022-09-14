import {
  BinanceAccountInformation,
  BinanceExchangeInfo,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import { Binance } from "../context.js";
import accountInfo from "./accountInfo.json";
import exchangeInfo from "./exchangeInfo.json";

export class BinanceClientMock implements Binance {
  async account() {
    return Promise.resolve(accountInfo as unknown as BinanceAccountInformation);
  }

  async tickerPrice(symbol: string) {
    return Promise.resolve({ symbol, price: "0" });
  }

  async exchangeInfo() {
    return Promise.resolve(exchangeInfo as unknown as BinanceExchangeInfo);
  }

  async newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">
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
