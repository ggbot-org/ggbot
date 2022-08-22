import { isLiteralType } from "@ggbot2/models";

export type BinanceAccountInformation = {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: BinanceBalance[];
  permissions: string[];
};

export type BinanceApiKeyPermission = {
  ipRestrict: boolean;

  createTime: number;

  /**
   * This option allows you to withdraw via API.
   * You must apply the IP Access Restriction filter in order to enable withdrawals.
   */
  enableWithdrawals: boolean;

  /**
   * This option authorizes this key to transfer funds between your master account and your sub account instantly.
   */
  enableInternalTransfer: boolean;

  /**
   * Authorizes this key to be used for a dedicated universal transfer API to transfer multiple supported currencies. Each business's own transfer API rights are not affected by this authorization.
   */
  permitsUniversalTransfer: boolean;

  /**
   * Authorizes this key to Vanilla options trading.
   */
  enableVanillaOptions: boolean;

  enableReading: boolean;

  /**
   * API Key created before your futures account opened does not support futures API service.
   */
  enableFutures: boolean;

  /**
   * This option can be adjusted after the Cross Margin account transfer is completed.
   */
  enableMargin: boolean;

  /**
   * Spot and margin trading.
   */
  enableSpotAndMarginTrading: boolean;

  /**
   * Expiration time for spot and margin trading permission.
   */
  tradingAuthorityExpirationTime: number;
};

export type BinanceAvgPrice = {
  /**
   * Is the number of minutes the average price is calculated over.
   */
  mins: number;
  price: string;
};

export type BinanceBalance = {
  asset: string;
  free: string;
  locked: string;
};

export type BinanceExchangeInfo = {
  timezone: string;
  serverTime: number;
  symbols: BinanceSymbolInfo[];
  rateLimits: BinanceRateLimitInfo[];
};

export const binanceKlineIntervals = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
] as const;
export type BinanceKlineInterval = typeof binanceKlineIntervals[number];
export const isBinanceKlineInterval = isLiteralType<BinanceKlineInterval>(
  binanceKlineIntervals
);

export declare type BinanceNewOrderOptions = Partial<{
  timeInForce: BinanceTimeInForce;
  quantity: number;
  quoteOrderQty: number;
  price: number;
  newClientOrderId: string;
  stopPrice: number;
  icebergQty: number;
  newOrderRespType: BinanceOrderRespType;
  recvWindow: number;
}>;

export const binanceOrderRespTypes = ["ACK", "RESULT", "FULL"] as const;
export type BinanceOrderRespType = typeof binanceOrderRespTypes[number];
export const isBinanceOrderRespType = isLiteralType<BinanceOrderRespType>(
  binanceOrderRespTypes
);

export const binanceOrderSides = ["BUY", "SELL"] as const;
export type BinanceOrderSide = typeof binanceOrderSides[number];
export const isBinanceOrderSide =
  isLiteralType<BinanceOrderSide>(binanceOrderSides);

export const binanceOrderTypes = [
  "LIMIT",
  "LIMIT_MAKER",
  "MARKET",
  "STOP_LOSS",
  "STOP_LOSS_LIMIT",
  "TAKE_PROFIT",
  "TAKE_PROFIT_LIMIT",
] as const;
export type BinanceOrderType = typeof binanceOrderTypes[number];
export const isBinanceOrderType =
  isLiteralType<BinanceOrderType>(binanceOrderTypes);

export type BinanceRateLimitInfo = {
  rateLimitType: BinanceRateLimitType;
  interval: BinanceRateLimitInterval;
  intervalNum: number;
  limit: number;
};

export const binanceRateLimitIntervals = ["SECOND", "MINUTE", "DAY"] as const;
export type BinanceRateLimitInterval = typeof binanceRateLimitIntervals[number];
export const isBinanceRateLimitInterval =
  isLiteralType<BinanceRateLimitInterval>(binanceRateLimitIntervals);

export const binanceRateLimitTypes = [
  "ORDERS",
  "RAW_REQUESTS",
  "REQUEST_WEIGHT",
] as const;
export type BinanceRateLimitType = typeof binanceRateLimitTypes[number];
export const isBinanceRateLimitType = isLiteralType<BinanceRateLimitType>(
  binanceRateLimitTypes
);

export type BinanceSymbolInfo = {
  symbol: string;
  status: BinanceSymbolStatus;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  orderTypes: BinanceOrderType[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: BinanceSymbolInfoFilter[];
  // TODO permissions
};

export type BinanceSymbolInfoFilter =
  | BinanceSymbolInfoFilterLotSize
  | BinanceSymbolInfoFilterMinNotional;

export type BinanceSymbolInfoFilterLotSize = {
  filterType: "LOT_SIZE";
  minQty: string;
  maxQty: string;
  stepSize: string;
};

export type BinanceSymbolInfoFilterMinNotional = {
  filterType: "MIN_NOTIONAL";
  minNotional: string;
  applyToMarket: boolean;
  avgPriceMins: number;
};

export const binanceSymbolStatuses = ["TRADING", "BREAK"] as const;
export type BinanceSymbolStatus = typeof binanceSymbolStatuses[number];
export const isBinanceSymbolStatus = isLiteralType<BinanceSymbolStatus>(
  binanceSymbolStatuses
);

export const binanceTimeInForces = [
  /**
   * Good Til Canceled. An order will be on the book unless the order is canceled.
   */
  "GTC",

  /**
   * Immediate Or Cancel. An order will try to fill the order as much as it can before the order expires.
   */
  "IOC",

  /**
   * Fill or Kill. An order will expire if the full order cannot be filled upon execution.
   */
  "FOK",
] as const;
export type BinanceTimeInForce = typeof binanceTimeInForces[number];
export const isBinanceTimeInForce =
  isLiteralType<BinanceTimeInForce>(binanceTimeInForces);
