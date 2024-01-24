import {
	BinanceAccountInformation,
	BinanceConnector,
	BinanceExchange,
	BinanceExchangeInfo,
	BinanceKline,
	BinanceKlineInterval,
	BinanceKlineOptionalParameters,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceSymbolInfo,
	BinanceTickerPrice
} from "@workspace/binance"
import {BinanceClient} from "@workspace/binance-client"
import {DflowBinanceClient} from "@workspace/dflow"
import {ENV} from "@workspace/env"
import {BinanceProxyURLs} from '@workspace/locators'

/**
 * A Binance client that uses a proxy for private requests.
 *
 * @example
 *
 * ```ts
 * const binance = new Binance({ apiKey, apiSecret })
 * binance.publicClient.exchangeInfoCache = exchangeInfoCache
 * ```
 */
export class Binance implements DflowBinanceClient {
	readonly binanceProxy = new BinanceProxyURLs(ENV.BINANCE_PROXY_BASE_URL())
	// TODO remove binance-client from executor
	readonly privateClient: BinanceClient
	readonly publicClient = new BinanceExchange(BinanceConnector.defaultBaseUrl)

	// TODO Also no need to pass apiKey and apiSecret here, needs accountId to pass it to authentication header
	constructor(apiKey: string, apiSecret: string) {
		this.privateClient = new BinanceClient(apiKey, apiSecret)
	}

	async account(): Promise<BinanceAccountInformation> {
		return await this.privateClient.account()
	}

	async candles(
		symbol: string,
		interval: BinanceKlineInterval,
		limit: number
	): Promise<BinanceKline[]> {
		return await this.publicClient.klines(symbol, interval, {limit})
	}

	async exchangeInfo(): Promise<BinanceExchangeInfo> {
		return await this.publicClient.exchangeInfo()
	}

	async klines(
		symbol: string,
		interval: BinanceKlineInterval,
		optionalParameters: BinanceKlineOptionalParameters
	): Promise<BinanceKline[]> {
		return await this.publicClient.klines(
			symbol,
			interval,
			optionalParameters
		)
	}

	async newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	): Promise<BinanceOrderRespFULL> {
		return this.privateClient.newOrder(symbol, side, type, orderOptions)
	}

	symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
		return this.publicClient.symbolInfo(symbol)
	}

	async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
		return this.publicClient.tickerPrice(symbol)
	}
}
