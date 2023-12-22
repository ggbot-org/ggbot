import { BinanceOrderType, BinanceSymbolFilter } from "./types.js"

export class ErrorBinanceHTTP extends Error {
	static errorName = "ErrorBinanceHTTP"
	endpoint: string
	status: Response["status"]
	statusText: Response["statusText"]

	constructor(response: Response) {
		super(ErrorBinanceHTTP.message(response))
		this.name = ErrorBinanceHTTP.errorName
		const { endpoint, status, statusText } =
			ErrorBinanceHTTP.responseInfo(response)
		this.endpoint = endpoint
		this.status = status
		this.statusText = statusText
	}

	static responseInfo(response: Response) {
		const url = new URL(response.url)
		return {
			status: response.status,
			statusText: response.statusText,
			// Hide search params, they may contain signature.
			endpoint: url.pathname
		}
	}

	static message(response: Response) {
		const { status, statusText, endpoint } =
			ErrorBinanceHTTP.responseInfo(response)
		return `Server responded with status=${status} statusText=${statusText} on endpoint=${endpoint}`
	}

	toJSON() {
		return this.toValue()
	}

	toValue() {
		return {
			name: ErrorBinanceHTTP.errorName,
			info: {
				endpoint: this.endpoint,
				status: this.status,
				statusText: this.statusText
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
