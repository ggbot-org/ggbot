import { BinanceOrderType, BinanceSymbolFilter } from "./types.js"

export class ErrorBinanceHTTP extends Error {
	static errorName = "ErrorBinanceHTTP"
	endpoint: string
	status: Response["status"]
	statusText: Response["statusText"]

	constructor(response: Response) {
		super(ErrorBinanceHTTP.message(response))
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
	}
	static message() {
		return "Binance cannot trade this symbol"
	}
}

export class ErrorBinanceSymbolFilter extends Error {
	static errorName = "ErrorBinanceSymbolFilter"
	filterType: BinanceSymbolFilter["filterType"]
	constructor({ filterType }: Pick<ErrorBinanceSymbolFilter, "filterType">) {
		super(ErrorBinanceSymbolFilter.message(filterType))
		this.filterType = filterType
	}
	static message(filterType: ErrorBinanceSymbolFilter["filterType"]) {
		return `Binance filter ${filterType} violated`
	}
}

export class ErrorBinanceInvalidOrderOptions extends Error {
	static errorName = "ErrorBinanceInvalidOrderOptions"
	constructor() {
		super(ErrorBinanceInvalidOrderOptions.message())
	}
	static message() {
		return "Invalid Binance order options"
	}
}
