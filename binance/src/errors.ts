import { BinanceOrderType, BinanceSymbolFilter } from "./types.js"

export class ErrorBinanceBadRequest extends Error {
	static errorName = "ErrorBinanceBadRequest"
	pathname: string

	constructor(response: Response) {
		super(ErrorBinanceBadRequest.message(response))
		const url = new URL(response.url)
		// Hide search params, which contains signature, and host which may point to BINANCE_PROXY_BASE_URL.
		this.pathname = url.pathname
		this.name = ErrorBinanceBadRequest.errorName
	}

	static message({
		status,
		statusText,
		url
	}: Pick<Response, "status" | "statusText" | "url">) {
		return `Server responded with status=${status} statusText=${statusText} on URL=${url}`
	}
	toJSON() {
		return this.toValue()
	}
	toValue() {
		return {
			name: ErrorBinanceBadRequest.errorName,
			info: {
				pathname: this.pathname
			}
		}
	}
}

export class ErrorBinanceCannotTradeSymbol extends Error {
	static errorName = "ErrorBinanceCannotTradeSymbol"
	readonly symbol: unknown
	readonly orderType: BinanceOrderType
	constructor({
		symbol,
		orderType
	}: Pick<ErrorBinanceCannotTradeSymbol, "symbol" | "orderType">) {
		super(ErrorBinanceCannotTradeSymbol.message())
		this.symbol = symbol
		this.orderType = orderType
		this.name = ErrorBinanceCannotTradeSymbol.errorName
	}
	static message() {
		return "Binance cannot trade this symbol"
	}
}

export class ErrorBinanceInvalidArg extends Error {
	static errorName = "ErrorBinanceInvalidArg"
	arg: unknown
	type: "klineInterval" | "orderType" | "orderSide" | "symbol"
	constructor({ arg, type }: Pick<ErrorBinanceInvalidArg, "arg" | "type">) {
		super(ErrorBinanceInvalidArg.message())
		this.arg = arg
		this.type = type
		this.name = ErrorBinanceInvalidArg.errorName
	}
	static message() {
		return "Invalid Binance argument"
	}
}

export class ErrorBinanceSymbolFilter extends Error {
	static errorName = "ErrorBinanceSymbolFilter"
	filterType: BinanceSymbolFilter["filterType"]
	constructor({ filterType }: Pick<ErrorBinanceSymbolFilter, "filterType">) {
		super(ErrorBinanceSymbolFilter.message(filterType))
		this.filterType = filterType
		this.name = ErrorBinanceSymbolFilter.errorName
	}
	static message(filterType: ErrorBinanceSymbolFilter["filterType"]) {
		return `Binance filter ${filterType} violated`
	}
}

export class ErrorBinanceInvalidOrderOptions extends Error {
	static errorName = "ErrorBinanceInvalidOrderOptions"
	constructor() {
		super(ErrorBinanceInvalidOrderOptions.message())
		this.name = ErrorBinanceInvalidOrderOptions.errorName
	}
	static message() {
		return "Invalid Binance order options"
	}
}

export class ErrorBinanceInvalidKlineOptionalParameters extends Error {
	static errorName = "ErrorBinanceInvalidKlineOptionalParameters"
	constructor() {
		super(ErrorBinanceInvalidKlineOptionalParameters.message())
		this.name = ErrorBinanceInvalidKlineOptionalParameters.errorName
	}
	static message() {
		return "Invalid kline optional parameters"
	}
}
