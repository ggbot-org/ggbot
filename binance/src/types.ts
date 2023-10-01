import {
	binanceKlineIntervals,
	binanceOrderRespTypes,
	binanceOrderSides,
	binanceOrderStatuses,
	binanceOrderTypes,
	binancePermissions,
	binanceRateLimitIntervals,
	binanceRateLimitTypes,
	binanceSymbolStatuses,
	binanceTimeInForces
} from "./constants.js"

export type BinanceAccountInformation = {
	accountType: string
	balances: BinanceBalance[]
	brokered: boolean
	buyerCommission: number
	canDeposit: boolean
	canTrade: boolean
	canWithdraw: boolean
	makerCommission: number
	permissions: BinancePermission[]
	sellerCommission: number
	takerCommission: number
	updateTime: number
}

type BinanceAccountTrade = {
	symbol: string
	id: number
	orderId: number
	orderListId: number
	price: string
	qty: string
	quoteQty: string
	commission: string
	commissionAsset: string
	time: number
	isBuyer: boolean
	isMaker: boolean
	isBestMatch: boolean
}

export type BinanceApiKeyPermission = {
	ipRestrict: boolean
	createTime: number
	/**
	 * This option allows you to withdraw via API. You must apply the IP Access
	 * Restriction filter in order to enable withdrawals.
	 */
	enableWithdrawals: boolean
	/**
	 * This option authorizes this key to transfer funds between your master
	 * account and your sub account instantly.
	 */
	enableInternalTransfer: boolean
	/**
	 * Authorizes this key to be used for a dedicated universal transfer API to
	 * transfer multiple supported currencies. Each business's own transfer API
	 * rights are not affected by this authorization.
	 */
	permitsUniversalTransfer: boolean
	/** Authorizes this key to Vanilla options trading. */
	enableVanillaOptions: boolean
	enableReading: boolean
	/**
	 * API Key created before your futures account opened does not support
	 * futures API service.
	 */
	enableFutures: boolean
	/**
	 * This option can be adjusted after the Cross Margin account transfer is
	 * completed.
	 */
	enableMargin: boolean
	/** Spot and margin trading. */
	enableSpotAndMarginTrading: boolean
	/** Expiration time for spot and margin trading permission. */
	tradingAuthorityExpirationTime: number
}

export type BinanceAvgPrice = {
	/** Is the number of minutes the average price is calculated over. */
	mins: number
	price: string
}

/**
 * @example
 *
 * ```json
 * {
 * 	"asset": "BTC",
 * 	"free": "0.10189777",
 * 	"locked": "0.02466239"
 * }
 * ```
 */
export type BinanceBalance = {
	asset: string
	free: string
	locked: string
}

export type BinanceExchangeInfo = {
	timezone: string
	serverTime: number
	symbols: BinanceSymbolInfo[]
	rateLimits: BinanceRateLimitInfo[]
}

export type BinanceFill = Pick<
	BinanceAccountTrade,
	"price" | "qty" | "commission" | "commissionAsset"
> & {
	tradeId: BinanceAccountTrade["id"]
}

/**
 * Kline/candlestick bars for a symbol.
 *
 * Klines are uniquely identified by their open time.
 *
 * @example
 *
 * ```json
 *   [
 *     1499040000000,      // Kline open time
 *     "0.01634790",       // Open price
 *     "0.80000000",       // High price
 *     "0.01575800",       // Low price
 *     "0.01577100",       // Close price
 *     "148976.11427815",  // Volume
 *     1499644799999,      // Kline Close time
 *     "2434.19055334",    // Quote asset volume
 *     308,                // Number of trades
 *     "1756.87402397",    // Taker buy base asset volume
 *     "28.46694368",      // Taker buy quote asset volume
 *     "0"                 // Unused field, ignore.
 *   ]
 * ```
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
]

export type BinanceKlineInterval = (typeof binanceKlineIntervals)[number]

export type BinanceKlineOptionalParameters = Partial<{
	startTime: number
	endTime: number
	/** Default 500; max 1000. */
	limit: number
}>

export type BinanceNewOrderOptions = Partial<{
	timeInForce: BinanceTimeInForce
	quantity: string
	quoteOrderQty: string
	price: string
	/** A unique id among open orders. Automatically generated if not sent. */
	newClientOrderId: string
	/**
	 * Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT
	 * orders.
	 */
	stopPrice: number
	/**
	 * Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an
	 * iceberg order.
	 */
	icebergQty: number
	/**
	 * Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT
	 * orders. For more details on SPOT implementation on trailing stops,
	 *
	 * @see {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md|Trailing Stop FAQ}
	 */
	trailingDelta: number
	/**
	 * Set the response JSON. ACK, RESULT, or FULL; MARKET and LIMIT order types
	 * default to FULL, all other orders default to ACK.
	 */
	newOrderRespType: BinanceOrderRespType
	recvWindow: number
}>

type BinanceOrder = {
	symbol: string
	orderId: number
	orderListId: number
	clientOrderId: string
	price: string
	origQty: string
	executedQty: string
	cummulativeQuoteQty: string
	transactTime: number
	status: BinanceOrderStatus
	timeInForce: BinanceTimeInForce
	type: BinanceOrderType
	side: BinanceOrderSide
	stopPrice: string
	icebergQty: string
	time: number
	updateTime: number
	isWorking: boolean
	origQuoteOrderQty: string
}

export type BinanceOrderRespACK = Pick<
	BinanceOrder,
	"symbol" | "orderId" | "orderListId" | "clientOrderId" | "transactTime"
>

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
	fills: BinanceFill[]
}

type BinanceOrderRespType = (typeof binanceOrderRespTypes)[number]

export type BinanceOrderSide = (typeof binanceOrderSides)[number]

type BinanceOrderStatus = (typeof binanceOrderStatuses)[number]

export type BinanceOrderType = (typeof binanceOrderTypes)[number]

type BinancePermission = (typeof binancePermissions)[number]

type BinanceRateLimitInfo = {
	rateLimitType: BinanceRateLimitType
	interval: BinanceRateLimitInterval
	intervalNum: number
	limit: number
}

type BinanceRateLimitInterval = (typeof binanceRateLimitIntervals)[number]

type BinanceRateLimitType = (typeof binanceRateLimitTypes)[number]

export type BinanceSymbolInfo = {
	allowTrailingStop: boolean
	baseAsset: string
	baseAssetPrecision: number
	baseCommissionPrecision: number
	cancelReplaceAllowed: boolean
	filters: BinanceSymbolFilter[]
	icebergAllowed: boolean
	isMarginTradingAllowed: boolean
	isSpotTradingAllowed: boolean
	ocoAllowed: boolean
	orderTypes: BinanceOrderType[]
	permissions: BinancePermission[]
	quoteAsset: string
	quoteAssetPrecision: number
	quoteCommissionPrecision: number
	quoteOrderQtyMarketAllowed: boolean
	quotePrecision: number
	status: BinanceSymbolStatus
	symbol: string
}

export type BinanceSymbolFilter =
	| BinanceSymbolFilterLotSize
	| BinanceSymbolFilterIcebergParts
	| BinanceSymbolFilterMarketLotSize
	| BinanceSymbolFilterMaxNumOrders
	| BinanceSymbolFilterMaxNumAlgoOrders
	| BinanceSymbolFilterMinNotional
	| BinanceSymbolFilterPercentPrice
	| BinanceSymbolFilterPrice
	| BinanceSymbolFilterTrailingDelta

/**
 * @example
 *
 * ```json
 * {
 * 	"filterType": "ICEBERG_PARTS",
 * 	"limit": 10
 * }
 * ```
 */
type BinanceSymbolFilterIcebergParts = {
	filterType: "ICEBERG_PARTS"
	limit: number
}

/**
 * The `LOT_SIZE` filter defines the `quantity` (aka "lots" in auction terms)
 * rules for a symbol.
 *
 * In order to pass the lot size, the following must be true for
 * `quantity`/`icebergQty`:
 *
 * - `quantity >= minQtY`
 * - `quantity <= maxQty`
 * - `(quantity - minQty) % stepSize == 0`
 *
 * @example
 *
 * ```json
 * {
 * 	"filterType": "LOT_SIZE",
 * 	"minQty": "0.00100000",
 * 	"maxQty": "100000.00000000",
 * 	"stepSize": "0.00100000"
 * }
 * ```
 */
export type BinanceSymbolFilterLotSize = {
	filterType: "LOT_SIZE"
	/** Defines the minimum `quantity`/`icebergQty` allowed */
	minQty: string
	/** Defines the maximum `quantity`/`icebergQty` allowed */
	maxQty: string
	/**
	 * Defines the intervals that a `quantity`/`icebergQty` can be
	 * increased/decreased by
	 */
	stepSize: string
}

/**
 * @example
 *
 * ```json
 * {
 * 	"filterType": "MARKET_LOT_SIZE",
 * 	"minQty": "0.00000000",
 * 	"maxQty": "1201.84537855",
 * 	"stepSize": "0.00000000"
 * }
 * ```
 */
type BinanceSymbolFilterMarketLotSize = {
	filterType: "MARKET_LOT_SIZE"
	minQty: string
	maxQty: string
	stepSize: string
}

/**
 * @example
 *
 * ```json
 * {
 * 	"filterType": "MAX_NUM_ORDERS",
 * 	"maxNumOrders": 10
 * }
 * ```
 */
type BinanceSymbolFilterMaxNumOrders = {
	filterType: "MAX_NUM_ORDERS"
	maxNumOrders: number
}

/**
 * @example
 *
 * ```json
 *   {
 *     "filterType": "MAX_NUM_ALGO_ORDERS",
 *     "maxNumAlgoOrders": 10,
 *   },
 * ```
 */
type BinanceSymbolFilterMaxNumAlgoOrders = {
	filterType: "MAX_NUM_ALGO_ORDERS"
	maxNumAlgoOrders: number
}

/**
 * The `MIN_NOTIONAL` filter defines the minimum notional value allowed for an
 * order on a symbol. An order's notional value is the `price` * `quantity`. If
 * the order is an Algo order (e.g. `STOP_LOSS_LIMIT`), then the notional value
 * of the `stopPrice` * `quantity` will also be evaluated. If the order is an
 * Iceberg Order, then the notional value of the `price` * `icebergQty` will
 * also be evaluated. `applyToMarket` determines whether or not the
 * `MIN_NOTIONAL` filter will also be applied to `MARKET` orders. Since `MARKET`
 * orders have no price, the average price is used over the last avgPriceMins
 * minutes. `avgPriceMins` is the number of minutes the average price is
 * calculated over. 0 means the last price is used.
 *
 * @example
 *
 * ```json
 * {
 * 	"filterType": "MIN_NOTIONAL",
 * 	"minNotional": "0.00100000",
 * 	"applyToMarket": true,
 * 	"avgPriceMins": 5
 * }
 * ```
 */
export type BinanceSymbolFilterMinNotional = {
	filterType: "MIN_NOTIONAL"
	minNotional: string
	applyToMarket: boolean
	avgPriceMins: number
}

/**
 * @example
 *
 * ```json
 * {
 * 	"filterType": "PERCENT_PRICE",
 * 	"multiplierUp": "5",
 * 	"multiplierDown": "0.2",
 * 	"avgPriceMins": 5
 * }
 * ```
 */
type BinanceSymbolFilterPercentPrice = {
	filterType: "PERCENT_PRICE"
	multiplierUp: string
	multiplierDown: string
	avgPriceMins: number
}

/**
 * The `PRICE_FILTER` defines the price rules for a symbol.
 *
 * Any of the above variables can be set to 0, which disables that rule in the
 * `price filter`. In order to pass the `price filter`, the following must be
 * true for `price`/`stopPrice` of the enabled rules:
 *
 * - `price >= minPrice`
 * - `price <= maxPrice`
 * - `price % tickSize == 0`
 *
 * @example
 *
 * ```json
 * {
 * 	"filterType": "PRICE_FILTER",
 * 	"minPrice": "0.00000100",
 * 	"maxPrice": "100000.00000000",
 * 	"tickSize": "0.00000100"
 * }
 * ```
 */
type BinanceSymbolFilterPrice = {
	filterType: "PRICE_FILTER"
	/**
	 * Defines the minimum `price`/`stopPrice` allowed; disabled on `minPrice`
	 * == 0
	 */
	minPrice: string
	/**
	 * Defines the maximum `price`/`stopPrice` allowed; disabled on `maxPrice`
	 * == 0
	 */
	maxPrice: string
	/**
	 * Defines the intervals that a `price`/`stopPrice` can be
	 * increased/decreased by; disabled on `tickSize` == 0
	 */
	tickSize: string
}

/**
 * @example
 *
 * ```json
 *   {
 *      "filterType: "TRAILING_DELTA",
 *      "minTrailingAboveDelta": 10,
 *      "maxTrailingAboveDelta": 2000,
 *      "minTrailingBelowDelta": 10,
 *      "maxTrailingBelowDelta": 2000,
 *   }
 * ```
 */
type BinanceSymbolFilterTrailingDelta = {
	filterType: "TRAILING_DELTA"
	minTrailingAboveDelta: number
	maxTrailingAboveDelta: number
	minTrailingBelowDelta: number
	maxTrailingBelowDelta: number
}

type BinanceSymbolStatus = (typeof binanceSymbolStatuses)[number]

export type BinanceTickerPrice = {
	symbol: string
	price: string
}

/**
 * 24 hour rolling window price change statistics.
 *
 * @example
 *
 * ```json
 * {
 * 	"symbol": "BNBBTC",
 * 	"priceChange": "-94.99999800",
 * 	"priceChangePercent": "-95.960",
 * 	"weightedAvgPrice": "0.29628482",
 * 	"prevClosePrice": "0.10002000",
 * 	"lastPrice": "4.00000200",
 * 	"lastQty": "200.00000000",
 * 	"bidPrice": "4.00000000",
 * 	"bidQty": "100.00000000",
 * 	"askPrice": "4.00000200",
 * 	"askQty": "100.00000000",
 * 	"openPrice": "99.00000000",
 * 	"highPrice": "100.00000000",
 * 	"lowPrice": "0.10000000",
 * 	"volume": "8913.30000000",
 * 	"quoteVolume": "15.30000000",
 * 	"openTime": 1499783499040,
 * 	"closeTime": 1499869899040,
 * 	"firstId": 28385,
 * 	"lastId": 28460,
 * 	"count": 76
 * }
 * ```
 */
export type BinanceTicker24hr = {
	symbol: string
	priceChange: string
	priceChangePercent: string
	weightedAvgPrice: string
	prevClosePrice: string
	lastPrice: string
	lastQty: string
	bidPrice: string
	bidQty: string
	askPrice: string
	askQty: string
	openPrice: string
	highPrice: string
	lowPrice: string
	volume: string
	quoteVolume: string
	openTime: number
	closeTime: number
	/** First tradeId. */
	firstId: 28385
	/** Last tradeId. */
	lastId: 28460
	/** Trade count. */
	count: number
}

type BinanceTimeInForce = (typeof binanceTimeInForces)[number]
