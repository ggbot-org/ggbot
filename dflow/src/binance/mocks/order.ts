import { BinanceOrderRespFULL } from "@ggbot2/binance";

export const orderBuyBTCBUSD: BinanceOrderRespFULL = {
  symbol: "BTCBUSD",
  orderId: 6906110758,
  orderListId: -1,
  clientOrderId: "wTZV3TMi8cjYymQ7YAaHWx",
  transactTime: 1667846175202,
  price: "0.00000000",
  origQty: "0.00096000",
  executedQty: "0.00096000",
  cummulativeQuoteQty: "19.88286720",
  status: "FILLED",
  timeInForce: "GTC",
  type: "MARKET",
  side: "BUY",
  fills: [
    {
      price: "20711.32000000",
      qty: "0.00096000",
      commission: "0.00000000",
      commissionAsset: "BNB",
      tradeId: 594514232,
    },
  ],
};
