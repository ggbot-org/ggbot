import {
	BinanceErrorPayload,
	BinanceOrderType,
	BinanceSymbolFilter
} from "./types.js"

export class ErrorBinanceHTTP extends Error {
	static errorName = "ErrorBinanceHTTP"
	payload: BinanceErrorPayload | undefined
	info: {
		pathname: string
		searchParams: string
		status: Response["status"]
		statusText: Response["statusText"]
	}

	constructor(
		info: ErrorBinanceHTTP["info"],
		payload?: ErrorBinanceHTTP["payload"]
	) {
		super(ErrorBinanceHTTP.message(info, payload))
		this.info = info
		this.payload = payload
	}

	static message(
		{
			status,
			statusText,
			pathname,
			searchParams
		}: ErrorBinanceHTTP["info"],
		payload: ErrorBinanceHTTP["payload"]
	) {
		return `Server responded with status=${status} payload=${JSON.stringify(
			payload
		)} statusText=${statusText} pathname=${pathname} searchParams=${searchParams}`
	}

	toJSON(): {
		name: string
		info: ErrorBinanceHTTP["info"] & Pick<ErrorBinanceHTTP, "payload">
	} {
		return {
			name: ErrorBinanceHTTP.errorName,
			info: { ...this.info, payload: this.payload }
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
