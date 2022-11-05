import { isLiteralType } from "@ggbot2/models";

export type BinanceAccountInformation = {
  accountType: string;
  balances: BinanceBalance[];
  brokered: boolean;
  buyerCommission: number;
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  makerCommission: number;
  permissions: string[];
  sellerCommission: number;
  takerCommission: number;
  updateTime: number;
};

export type BinanceAccountTrade = {
  symbol: string;
  id: number;
  orderId: number;
  orderListId: number;
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
  isBestMatch: boolean;
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

export type BinanceFill = Pick<
  BinanceAccountTrade,
  "price" | "qty" | "commission" | "commissionAsset"
> & { tradeId: BinanceAccountTrade["id"] };

/**
Kline/candlestick bars for a symbol.
Klines are uniquely identified by their open time.

@example
```json
[
  1499040000000,      // Kline open time
  "0.01634790",       // Open price
  "0.80000000",       // High price
  "0.01575800",       // Low price
  "0.01577100",       // Close price
  "148976.11427815",  // Volume
  1499644799999,      // Kline Close time
  "2434.19055334",    // Quote asset volume
  308,                // Number of trades
  "1756.87402397",    // Taker buy base asset volume
  "28.46694368",      // Taker buy quote asset volume
  "0"                 // Unused field, ignore.
]
```
*/
export type BinanceKline = [
  openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  quoteVolume: string,
  numTrades: number,
  takerBaseVolume: string,
  takerQuoteVolume: string,
  _unused_field: string
];

export type BinanceKlineOptionalParameters = Partial<{
  startTime: number;
  endTime: number;
  /** Default 500; max 1000. */
  limit: number;
}>;

export type BinanceNewOrderOptions = Partial<{
  timeInForce: BinanceTimeInForce;
  quantity: string;
  quoteOrderQty: string;
  price: string;
  /** A unique id among open orders. Automatically generated if not sent. */
  newClientOrderId: string;
  /** Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders. */
  stopPrice: number;
  /** Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an iceberg order. */
  icebergQty: number;
  /**
   * Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders.
   * For more details on SPOT implementation on trailing stops,
   * @see {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md|Trailing Stop FAQ}
   */
  trailingDelta: number;
  /**
   * Set the response JSON. ACK, RESULT, or FULL;
   * MARKET and LIMIT order types default to FULL, all other orders default to ACK.
   */
  newOrderRespType: BinanceOrderRespType;
  recvWindow: number;
}>;

export type BinanceOrder = {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  transactTime: number;
  status: BinanceOrderStatus;
  timeInForce: BinanceTimeInForce;
  type: BinanceOrderType;
  side: BinanceOrderSide;
  stopPrice: string;
  icebergQty: string;
  time: number;
  updateTime: number;
  isWorking: boolean;
  origQuoteOrderQty: string;
};

export type BinanceOrderRespACK = Pick<
  BinanceOrder,
  "symbol" | "orderId" | "orderListId" | "clientOrderId" | "transactTime"
>;

export type BinanceOrderRespRESULT = Pick<
  BinanceOrder,
  | "symbol"
  | "orderId"
  | "orderListId"
  | "clientOrderId"
  | "transactTime"
  | "price"
  | "origQty"
  | "executedQty"
  | "cummulativeQuoteQty"
  | "status"
  | "timeInForce"
  | "type"
  | "side"
>;

export type BinanceOrderRespFULL = Pick<
  BinanceOrder,
  | "symbol"
  | "orderId"
  | "orderListId"
  | "clientOrderId"
  | "transactTime"
  | "price"
  | "origQty"
  | "executedQty"
  | "cummulativeQuoteQty"
  | "status"
  | "timeInForce"
  | "type"
  | "side"
> & {
  fills: BinanceFill[];
};

export const binanceOrderRespTypes = ["ACK", "RESULT", "FULL"] as const;
export type BinanceOrderRespType = typeof binanceOrderRespTypes[number];
export const isBinanceOrderRespType = isLiteralType<BinanceOrderRespType>(
  binanceOrderRespTypes
);

export const binanceOrderSides = ["BUY", "SELL"] as const;
export type BinanceOrderSide = typeof binanceOrderSides[number];
export const isBinanceOrderSide =
  isLiteralType<BinanceOrderSide>(binanceOrderSides);

export const binanceOrderStatuses = [
  // The order has been accepted by the engine.
  "NEW",
  // A part of the order has been filled.
  "PARTIALLY_FILLED",
  // The order has been completed.
  "FILLED",
  // The order has been canceled by the user.
  "CANCELED",
  // Currently unused
  "PENDING_CANCEL",
  // The order was not accepted by the engine and not processed.
  "REJECTED",
  // The order was canceled according to the order type's rules (e.g. LIMIT FOK orders with no fill, LIMIT IOC or MARKET orders that partially fill) or by the exchange, (e.g. orders canceled during liquidation, orders canceled during maintenance)
  "EXPIRED",
] as const;
export type BinanceOrderStatus = typeof binanceOrderStatuses[number];
export const isBinanceOrderStatus =
  isLiteralType<BinanceOrderStatus>(binanceOrderStatuses);

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

export const binancePermissions = [
  "SPOT",
  "MARGIN",
  "LEVERAGED",
  "TRD_GRP_002",
  "TRD_GRP_003",
  "TRD_GRP_004",
  "TRD_GRP_005",
] as const;
export type BinancePermissions = typeof binancePermissions[number];
export const isBinancePermission =
  isLiteralType<BinancePermissions>(binancePermissions);

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
  allowTrailingStop: boolean;
  baseAsset: string;
  baseAssetPrecision: number;
  baseCommissionPrecision: number;
  cancelReplaceAllowed: boolean;
  filters: BinanceSymbolFilter[];
  icebergAllowed: boolean;
  isMarginTradingAllowed: boolean;
  isSpotTradingAllowed: boolean;
  ocoAllowed: boolean;
  orderTypes: BinanceOrderType[];
  permissions: BinancePermissions;
  quoteAsset: string;
  quoteAssetPrecision: number;
  quoteCommissionPrecision: number;
  quoteOrderQtyMarketAllowed: boolean;
  quotePrecision: number;
  status: BinanceSymbolStatus;
  symbol: string;
};

export type BinanceSymbolFilter =
  | BinanceSymbolFilterLotSize
  | BinanceSymbolFilterMinNotional
  | BinanceSymbolFilterPrice;

/**
The `LOT_SIZE` filter defines the `quantity` (aka "lots" in auction terms) rules for a symbol.

In order to pass the lot size, the following must be true for `quantity`/`icebergQty`:

- `quantity` >= `minQtY`
- `quantity` <= `maxQty`
- (`quantity` - `minQty`) % `stepSize` == 0

@example
```json
{
  "filterType": "LOT_SIZE",
  "minQty": "0.00100000",
  "maxQty": "100000.00000000",
  "stepSize": "0.00100000"
}
```
*/
export type BinanceSymbolFilterLotSize = {
  filterType: "LOT_SIZE";
  /** defines the minimum `quantity`/`icebergQty` allowed */
  minQty: string;
  /** defines the maximum `quantity`/`icebergQty` allowed */
  maxQty: string;
  /** defines the intervals that a `quantity`/`icebergQty` can be increased/decreased by */
  stepSize: string;
};

/**
The `MIN_NOTIONAL` filter defines the minimum notional value allowed for an order on a symbol.
An order's notional value is the `price` * `quantity`.
If the order is an Algo order (e.g. `STOP_LOSS_LIMIT`), then the notional value of the `stopPrice` * `quantity` will also be evaluated.
If the order is an Iceberg Order, then the notional value of the `price` * `icebergQty` will also be evaluated.
`applyToMarket` determines whether or not the `MIN_NOTIONAL` filter will also be applied to `MARKET` orders.
Since `MARKET` orders have no price, the average price is used over the last avgPriceMins minutes.
`avgPriceMins` is the number of minutes the average price is calculated over. 0 means the last price is used.

@example
```json
{
  "filterType": "MIN_NOTIONAL",
  "minNotional": "0.00100000",
  "applyToMarket": true,
  "avgPriceMins": 5
}
```
*/
export type BinanceSymbolFilterMinNotional = {
  filterType: "MIN_NOTIONAL";
  minNotional: string;
  applyToMarket: boolean;
  avgPriceMins: number;
};

/**
The `PRICE_FILTER` defines the price rules for a symbol.

Any of the above variables can be set to 0, which disables that rule in the `price filter`.
In order to pass the `price filter`, the following must be true for `price`/`stopPrice` of the enabled rules:

- `price` >= `minPrice`
- `price` <= `maxPrice`
- `price` % `tickSize` == 0

@example
```json
{
  "filterType": "PRICE_FILTER",
  "minPrice": "0.00000100",
  "maxPrice": "100000.00000000",
  "tickSize": "0.00000100"
}
```
*/
export type BinanceSymbolFilterPrice = {
  filterType: "PRICE_FILTER";
  /** defines the minimum `price`/`stopPrice` allowed; disabled on `minPrice` == 0 */
  minPrice: string;
  /** defines the maximum `price`/`stopPrice` allowed; disabled on `maxPrice` == 0 */
  maxPrice: string;
  /** defines the intervals that a `price`/`stopPrice` can be increased/decreased by; disabled on `tickSize` == 0 */
  tickSize: string;
};

export const binanceSymbolStatuses = [
  "PRE_TRADING",
  "TRADING",
  "POST_TRADING",
  "END_OF_DAY",
  "HALT",
  "AUCTION_MATCH",
  "BREAK",
] as const;
export type BinanceSymbolStatus = typeof binanceSymbolStatuses[number];
export const isBinanceSymbolStatus = isLiteralType<BinanceSymbolStatus>(
  binanceSymbolStatuses
);

export type BinanceTickerPrice = {
  symbol: string;
  price: string;
};

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
