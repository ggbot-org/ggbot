import { objectTypeGuard } from "minimal-type-guard-helpers"

import { isBinanceErrorPayload } from "./typeGuards.js"
import { BinanceErrorPayload, BinanceSymbolFilter } from "./types.js"

type ErrorBinanceHTTPInfo = {
	payload: BinanceErrorPayload
	pathname: string
	searchParams: string
	status: Response["status"]
	statusText: Response["statusText"]
}

export const isErrorBinanceHTTPInfo = objectTypeGuard<ErrorBinanceHTTPInfo>(
	({ payload, pathname, searchParams, status, statusText }) => isBinanceErrorPayload(payload) &&
		typeof pathname === "string" &&
		typeof searchParams === "string" &&
		typeof status === "number" &&
		typeof statusText === "string"
)

export class ErrorBinanceHTTP extends Error {
	static errorName = "ErrorBinanceHTTP"
	info: ErrorBinanceHTTPInfo

	constructor(info: ErrorBinanceHTTP["info"]) {
		super(ErrorBinanceHTTP.message(info))
		this.info = info
	}

	static message({ status, statusText, pathname, payload, searchParams }: ErrorBinanceHTTPInfo) {
		return `Server responded with status=${status} payload=${JSON.stringify(payload)} statusText=${statusText} pathname=${pathname} searchParams=${searchParams}`
	}

	toJSON(): {
		name: string
		info: ErrorBinanceHTTPInfo
	} {
		return {
			name: ErrorBinanceHTTP.errorName,
			info: this.info
		}
	}
}

export class ErrorBinanceSymbolFilter extends Error {
	static errorName = "ErrorBinanceSymbolFilter"
	filterType: BinanceSymbolFilter["filterType"]
	constructor({ filterType, detail }: Pick<ErrorBinanceSymbolFilter, "filterType"> & { detail: string }) {
		super(ErrorBinanceSymbolFilter.message(filterType, detail))
		this.filterType = filterType
	}
	static message(
		filterType: ErrorBinanceSymbolFilter["filterType"],
		detail: string
	) {
		return `Binance filter ${filterType} violated, ${detail}`
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
