import {isLiteralType} from "minimal-type-guard-helpers"

export class BinanceProxyBaseURL extends URL {
	static port = 1221
	constructor(origin: string) {
		super(`http://${origin}:${BinanceProxyBaseURL.port}`)
	}
}

const binanceProxyPathnames = ["/order", "/apiRestrictions"] as const
export type BinanceProxyPathname = (typeof binanceProxyPathnames)[number]
export const isBinanceProxyPathname = isLiteralType<BinanceProxyPathname>(
	binanceProxyPathnames
)

const binanceProxyPathname: Record<string, BinanceProxyPathname> = {
	apiRestrictions: "/apiRestrictions",
	order: "/order"
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

	get apiRestrictions() {
		return new URL(binanceProxyPathname.apiRestrictions, this.baseURL)
	}

	get order() {
		return new URL(binanceProxyPathname.order, this.baseURL)
	}
}
