export const binanceKlineIntervals = [
	"1s",
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
	"1M"
] as const
export const binanceKlineMaxLimit = 1000

export const binanceOrderTypes = [
	"LIMIT",
	"LIMIT_MAKER",
	"MARKET",
	"STOP_LOSS",
	"STOP_LOSS_LIMIT",
	"TAKE_PROFIT",
	"TAKE_PROFIT_LIMIT"
] as const

export const binanceOrderRespTypes = ["ACK", "RESULT", "FULL"] as const

export const binanceOrderSides = ["BUY", "SELL"] as const

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
	"EXPIRED"
] as const

export const binancePermissions = [
	"SPOT",
	"MARGIN",
	"LEVERAGED",
	"TRD_GRP_002",
	"TRD_GRP_003",
	"TRD_GRP_004",
	"TRD_GRP_005"
] as const

export const binanceRateLimitIntervals = ["SECOND", "MINUTE", "DAY"] as const

export const binanceRateLimitTypes = [
	"ORDERS",
	"RAW_REQUESTS",
	"REQUEST_WEIGHT"
] as const

export const binanceSymbolStatuses = [
	"PRE_TRADING",
	"TRADING",
	"POST_TRADING",
	"END_OF_DAY",
	"HALT",
	"AUCTION_MATCH",
	"BREAK"
] as const

export const binanceTimeInForces = [
	/**
	 * Good Til Canceled. An order will be on the book unless the order is
	 * canceled.
	 */
	"GTC",
	/**
	 * Immediate Or Cancel. An order will try to fill the order as much as it
	 * can before the order expires.
	 */
	"IOC",
	/**
	 * Fill or Kill. An order will expire if the full order cannot be filled
	 * upon execution.
	 */
	"FOK"
] as const
