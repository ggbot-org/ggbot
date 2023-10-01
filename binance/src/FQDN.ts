export const binanceApiDomain = "api.binance.com"

const binanceApiClusters = [
	"api1.binance.com",
	"api2.binance.com",
	"api3.binance.com"
] as const
const binanceApiDomains = [binanceApiDomain, ...binanceApiClusters] as const
export type BinanceApiDomain = (typeof binanceApiDomains)[number]
