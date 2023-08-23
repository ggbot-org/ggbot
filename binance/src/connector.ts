import { __400__BAD_REQUEST__, ErrorHTTP } from "@workspace/http"

import { BinanceApiEndpoint } from "./endpoints.js"
import { ErrorBinanceBadRequest } from "./errors.js"
import { binanceApiDomain } from "./FQDN.js"
import { BinanceRequestHeaders } from "./headers.js"
import { BinanceApiRequestMethod, BinanceApiRequestParams } from "./request.js"

/** BinanceConnector handles requests to Binance API. */
export class BinanceConnector {
	static defaultBaseUrl = `https://${binanceApiDomain}`
	baseUrl: string
	readonly requestHeaders: BinanceRequestHeaders

	constructor(baseUrl = BinanceConnector.defaultBaseUrl) {
		this.baseUrl = baseUrl
		this.requestHeaders = new BinanceRequestHeaders()
	}

	set apiKey(value: string) {
		this.requestHeaders.apiKey = value
	}

	async request<Data>(
		method: BinanceApiRequestMethod,
		endpoint: BinanceApiEndpoint,
		params: BinanceApiRequestParams = {}
	) {
		const fetchOptions: RequestInit = {
			headers: this.requestHeaders,
			method
		}

		const url = new URL(this.baseUrl)
		url.pathname = endpoint

		for (const [key, value] of Object.entries(params)) {
			if (value === undefined) continue
			// The array conversion logic is different from usual query string.
			// E.g. symbols=["BTCUSDT","BNBBTC"] instead of symbols[]=BTCUSDT&symbols[]=BNBBTC
			const valueString = Array.isArray(value)
				? `["${value.join('","')}"]`
				: value
			url.searchParams.append(key, String(valueString))
		}

		const response = await fetch(url, fetchOptions)
		if (!response.ok) {
			if (response.status === __400__BAD_REQUEST__)
				throw new ErrorBinanceBadRequest(response)
			throw new ErrorHTTP(response)
		}

		const data = await response.json()
		return data as Data
	}
}
