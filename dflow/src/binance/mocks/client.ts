import {
  BinanceAccountInformation,
  BinanceExchangeInfo,
  BinanceNewOrderOptions,
  BinanceOrderRespFULL,
  BinanceOrderSide,
  BinanceOrderType,
  ErrorInvalidBinanceOrderOptions,
} from "@ggbot2/binance";
import { binanceDiv, binanceMul } from "../arithmetic.js";
import { BinanceDflow } from "../context.js";
import accountInfo from "./accountInfo.json";
import exchangeInfo from "./exchangeInfo.json";

export class BinanceClientMock implements BinanceDflow {
  get nextClientOrderId() {
    return "";
  }

  get nextOrderId() {
    return 0;
  }

  get nextTradeId() {
    return 0;
  }

  get unixTime() {
    return new Date().getTime();
  }

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
    type: Extract<BinanceOrderType, "MARKET">,
    orderOptions: BinanceNewOrderOptions
  ) {
    const price = "20649.57000000";

    const quantity =
      typeof orderOptions.quantity === "string"
        ? orderOptions.quantity
        : typeof orderOptions.quoteOrderQty === "string"
        ? binanceDiv(price, orderOptions.quoteOrderQty)
        : undefined;

    const quoteOrderQty =
      typeof orderOptions.quoteOrderQty === "string"
        ? orderOptions.quoteOrderQty
        : typeof orderOptions.quantity === "string"
        ? binanceMul(price, orderOptions.quantity)
        : undefined;

    if (typeof quantity === "undefined" || typeof quoteOrderQty === "undefined")
      throw new ErrorInvalidBinanceOrderOptions();

    const orderResp: BinanceOrderRespFULL = {
      symbol,
      orderId: this.nextOrderId,
      orderListId: -1,
      clientOrderId: orderOptions.newClientOrderId ?? this.nextClientOrderId,
      transactTime: this.unixTime,
      price: "0.00000000",
      origQty: quantity,
      executedQty: quantity,
      cummulativeQuoteQty: quoteOrderQty,
      status: "FILLED",
      timeInForce: "GTC",
      type,
      side,
      fills: [
        {
          price,
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
