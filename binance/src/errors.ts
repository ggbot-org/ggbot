import { BinanceOrderType, BinanceSymbolFilter } from "./types.js"

type ErrorBinanceHTTPInfo = Pick<
	ErrorBinanceHTTP,
	"pathname" | "searchParams" | "status" | "statusText"
>

export class ErrorBinanceHTTP extends Error {
	static errorName = "ErrorBinanceHTTP"
	pathname: string
	searchParams: string
	status: Response["status"]
	statusText: Response["statusText"]

	constructor(info: ErrorBinanceHTTPInfo) {
		super(ErrorBinanceHTTP.message(info))
		this.pathname = info.pathname
		this.status = info.status
		this.statusText = info.statusText
		this.searchParams = info.searchParams
	}

	static message({
		status,
		statusText,
		pathname,
		searchParams
	}: ErrorBinanceHTTPInfo) {
		return `Server responded with status=${status} statusText=${statusText} on pathname=${pathname} with searchParams=${searchParams}`
	}

	toJSON(): { name: string; info: ErrorBinanceHTTPInfo } {
		return {
			name: ErrorBinanceHTTP.errorName,
			info: {
				pathname: this.pathname,
				searchParams: this.searchParams,
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
