export const binanceApiEndpoints = [
  "/api/v3/account",
  "/api/v3/avgPrice",
  "/api/v3/exchangeInfo",
  "/api/v3/klines",
  "/api/v3/order",
  "/api/v3/order/test",
  "/api/v3/ticker/24hr",
  "/api/v3/ticker/price",
  "/api/v3/uiKlines",
  "/sapi/v1/account/apiRestrictions",
] as const;

export type BinanceApiEndpoint = typeof binanceApiEndpoints[number];
