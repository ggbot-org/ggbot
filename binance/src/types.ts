// Enums are documented here:
// https://binance-docs.github.io/apidocs/spot/en/#public-api-definitions

export type BinanceAsset = string;

export type BinanceApiResponse<Data> = {
  status: number;
  statusText: string;
  data: Data;
};

export type BinanceOrderType =
  | "LIMIT"
  | "LIMIT_MAKER"
  | "MARKET"
  | "STOP_LOSS"
  | "STOP_LOSS_LIMIT"
  | "TAKE_PROFIT"
  | "TAKE_PROFIT_LIMIT";

export type BinanceQuantity = "string";

export type BinanceSymbol = string;

export type BinanceSymbolInfoFilter =
  | BinanceSymbolInfoFilterLotSize
  | BinanceSymbolInfoFilterMinNotional;

export type BinanceSymbolInfoFilterLotSize = {
  filterType: "LOT_SIZE";
  minQty: BinanceQuantity;
  maxQty: BinanceQuantity;
  stepSize: BinanceQuantity;
};

export type BinanceSymbolInfoFilterMinNotional = {
  filterType: "MIN_NOTIONAL";
  minNotional: BinanceQuantity;
  applyToMarket: boolean;
  avgPriceMins: number;
};

export type BinanceSymbolStatus = "TRADING" | "BREAK";

export type BinanceTime = number;

export type BinanceSymbolInfo = {
  symbol: BinanceSymbol;
  status: BinanceSymbolStatus;
  baseAsset: BinanceAsset;
  baseAssetPrecision: number;
  quoteAsset: BinanceAsset;
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

export type BinanceExchangeInfo = {
  timezone: string;
  serverTime: BinanceTime;
  symbols: BinanceSymbolInfo[];
  rateLimits: BinanceRateLimitInfo[];
};

export declare type BinanceRateLimitInfo = {
  rateLimitType: BinanceRateLimitType;
  interval: BinanceRateLimitInterval;
  intervalNum: number;
  limit: number;
};

export type BinanceRateLimitInterval = "SECOND" | "MINUTE" | "DAY";

export type BinanceRateLimitType = "ORDERS" | "RAW_REQUESTS" | "REQUEST_WEIGHT";
