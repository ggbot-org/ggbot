import { BinanceApiEndpoint } from "./endpoints.js"
import { ErrorBinanceHTTP } from "./errors.js"
import { BinanceApiDomain, binanceApiDomain } from "./FQDN.js"
import { BinanceRequestHeaders } from "./headers.js"
import { BinanceApiRequestMethod, BinanceApiRequestParams } from "./request.js"

/** BinanceConnector handles requests to Binance API. */
export class BinanceConnector {
	static defaultBaseUrl = BinanceConnector.baseUrl(binanceApiDomain)

	baseUrl: string
	readonly requestHeaders: BinanceRequestHeaders

	constructor(baseUrl = BinanceConnector.defaultBaseUrl) {
		this.baseUrl = baseUrl
		this.requestHeaders = new BinanceRequestHeaders()
	}

	set apiKey(value: string) {
		this.requestHeaders.apiKey = value
	}

	static baseUrl(apiDomain: BinanceApiDomain) {
		return `https://${apiDomain}`
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

		const url = new URL(endpoint, this.baseUrl)
		// Keep a copy of `url` for debug purpose. It will not include `signature` parameter.
		const debugUrl = new URL(endpoint, this.baseUrl)

		for (const [key, value] of Object.entries(params)) {
			if (value === undefined) continue
			// The array conversion logic is different from usual query string.
			// E.g. symbols=["BTCUSDT","BNBBTC"] instead of symbols[]=BTCUSDT&symbols[]=BNBBTC
			const valueString = Array.isArray(value)
				? `["${value.join('","')}"]`
				: value
			url.searchParams.append(key, String(valueString))
			if (key !== "signature")
				debugUrl.searchParams.append(key, String(valueString))
		}

		const response = await fetch(url, fetchOptions)
		if (!response.ok)
			throw new ErrorBinanceHTTP({
				status: response.status,
				statusText: response.statusText,
				pathname: url.pathname,
				searchParams: debugUrl.searchParams.toString()
			})

		return (await response.json()) as Data
	}
}
