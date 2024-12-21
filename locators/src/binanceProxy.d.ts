export declare class BinanceProxyBaseURL extends URL {
	static port: number
	constructor(origin: string)
}

/**
 * Defines binance-proxy service URLs.
 *
 * @example
 *
 * ```js
 * import { ENV } from '@workspace/env'
 *
 * const origin = ENV.BINANCE_PROXY_IP()
 * const binanceProxy = new BinanceProxyURLs(origin)
 * ```
 */
export declare class BinanceProxyURLs {
	constructor(origin: string)
	readonly action: URL
}
