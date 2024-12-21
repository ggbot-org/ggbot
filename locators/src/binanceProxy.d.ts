export declare class BinanceProxyBaseURL extends URL {
	static port: number
	constructor(origin: string)
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
export declare class BinanceProxyURLs {
	baseURL: BinanceProxyBaseURL
	constructor(origin: string)
	get action(): URL
}
