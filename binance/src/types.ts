export type BinanceAccountInformation = {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: BinanceTime;
  accountType: string;
  balances: BinanceBalance[];
  permissions: string[];
};

export type BinanceAvgPrice = {
  /**
   * is the number of minutes the average price is calculated over
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
  serverTime: BinanceTime;
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

export type BinanceRateLimitInfo = {
  rateLimitType: BinanceRateLimitType;
  interval: BinanceRateLimitInterval;
  intervalNum: number;
  limit: number;
};

export const binanceRateLimitIntervals = ["SECOND", "MINUTE", "DAY"] as const;
export type BinanceRateLimitInterval = typeof binanceRateLimitIntervals[number];

export const binanceRateLimitTypes = [
  "ORDERS",
  "RAW_REQUESTS",
  "REQUEST_WEIGHT",
] as const;
export type BinanceRateLimitType = typeof binanceRateLimitTypes[number];

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

export type BinanceTime = number;
