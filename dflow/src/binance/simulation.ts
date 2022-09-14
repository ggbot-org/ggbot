import {
  BinanceAccountInformation,
  BinanceConnector,
  BinanceExchange,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
} from "@ggbot2/binance";
import { mul } from "./arithmetic.js";
import { Binance } from "./context.js";
import accountInfo from "./mocks/accountInfo.json";

export class BinanceSimulation extends BinanceExchange implements Binance {
  timestamp: string;
  constructor(arg: Pick<BinanceSimulation, "timestamp">) {
    super({ baseUrl: BinanceConnector.defaultBaseUrl });
    this.timestamp = arg.timestamp;
  }
  private get nextOrderId() {
    return 0;
  }
  private get nextTradeId() {
    return 0;
  }
  private get unixTimestamp() {
    return new Date(this.timestamp).getTime();
  }
  account() {
    return Promise.resolve(accountInfo as unknown as BinanceAccountInformation);
  }
  async newOrder(
    symbol: string,
    side: BinanceOrderSide,
    type: Extract<BinanceOrderType, "MARKET">
  ) {
    const quantity = "0.00096000";
    const tickerPrice = "20649.57000000";
    const cummulativeQuoteQty = mul(quantity, tickerPrice);

    const orderResp: BinanceOrderRespFULL = {
      symbol,
      orderId: this.nextOrderId,
      orderListId: -1,
      clientOrderId: "R35e9hBjkwGc3nYqrQprM9",
      transactTime: this.unixTimestamp,
      price: "0.00000000",
      origQty: quantity,
      executedQty: quantity,
      cummulativeQuoteQty,
      status: "FILLED",
      timeInForce: "GTC",
      type,
      side,
      fills: [
        {
          price: tickerPrice,
          qty: quantity,
          commission: "0.00000000",
          commissionAsset: "BNB",
          tradeId: this.nextTradeId,
        },
      ],
    };
    return Promise.resolve(orderResp);
  }
}
