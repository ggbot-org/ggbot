import { isLiteralType } from "minimal-type-guard-helpers"

export class BinanceProxyBaseURL extends URL {
	static port = 1221
	constructor(origin: string) {
		super(`http://${origin}:${BinanceProxyBaseURL.port}`)
	}
}

const apiEndpoint = {
	action: "action"
}

/**
 * Defines binance-proxy service URLs.
 *
 * @example
 *
 * ```ts
 * import { ENV } from "@workspace/env"
 *
 * const binanceProxy = new BinanceProxyURLs(ENV.BINANCE_PROXY_BASE_URL())
 * ```
 */
export class BinanceProxyURLs {
	baseURL: BinanceProxyBaseURL

	constructor(origin: string) {
		this.baseURL = new BinanceProxyBaseURL(origin)
	}

	get action() {
		return new URL(apiEndpoint.action, this.baseURL)
	}
}
