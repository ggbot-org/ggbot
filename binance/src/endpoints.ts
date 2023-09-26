import { isLiteralType } from "minimal-type-guard-helpers"

export const binanceApiPrivateEndpoints = [
	"/api/v3/account",
	"/api/v3/order",
	"/api/v3/order/test",
	"/sapi/v1/account/apiRestrictions"
] as const

export type BinanceApiPrivateEndpoint =
	(typeof binanceApiPrivateEndpoints)[number]

export const isBinanceApiPrivateEndoint =
	isLiteralType<BinanceApiPrivateEndpoint>(binanceApiPrivateEndpoints)

export const binanceApiPublicEndpoints = [
	"/api/v3/avgPrice",
	"/api/v3/exchangeInfo",
	"/api/v3/klines",
	"/api/v3/ticker/24hr",
	"/api/v3/ticker/price",
	"/api/v3/uiKlines"
] as const

type BinanceApiPublicEndpoint = (typeof binanceApiPublicEndpoints)[number]

export const isBinanceApiPublicEndoint =
	isLiteralType<BinanceApiPublicEndpoint>(binanceApiPublicEndpoints)

export const binanceApiEndpoints = [
	...binanceApiPublicEndpoints,
	...binanceApiPrivateEndpoints
] as const

export type BinanceApiEndpoint = (typeof binanceApiEndpoints)[number]

export const isBinanceApiEndoint =
	isLiteralType<BinanceApiEndpoint>(binanceApiEndpoints)
