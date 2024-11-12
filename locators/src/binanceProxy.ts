export class BinanceProxyBaseURL extends URL {
	static port = 1221
	constructor(origin: string) {
		super(`http://${origin}:${BinanceProxyBaseURL.port}`)
	}
}

/**
 * Defines binance-proxy service URLs.
 *
 * @example
 *
 * ```ts
 * import { ENV } from "@workspace/env"
 *
 * const origin = ENV.BINANCE_PROXY_IP()
 * const binanceProxy = new BinanceProxyURLs(origin)
 * ```
 */
export class BinanceProxyURLs {
	baseURL: BinanceProxyBaseURL

	constructor(origin: string) {
		this.baseURL = new BinanceProxyBaseURL(origin)
	}

	get action() {
		return new URL('action', this.baseURL)
	}
}
