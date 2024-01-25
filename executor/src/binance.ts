import {
	ApiActionHeaders,
	ApiActionInput,
	BinanceProxyApiActionType,
	apiActionRequestInit,
} from "@workspace/api"
import {signSession} from "@workspace/authentication"
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
import {DflowBinanceClient} from "@workspace/dflow"
import {ENV} from "@workspace/env"
import {BinanceProxyURLs} from '@workspace/locators'
import {Account, ClientSession, SerializableData} from "@workspace/models"
import {today} from "minimal-time-helpers"

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
	readonly accountId: Account['id']
	binanceProxyApiActionHeaders: ApiActionHeaders | undefined
	readonly binanceProxy = new BinanceProxyURLs(ENV.BINANCE_PROXY_BASE_URL())
	readonly publicClient = new BinanceExchange(BinanceConnector.defaultBaseUrl)

	// TODO Also no need to pass apiKey and apiSecret here, needs accountId to pass it to authentication header
	constructor(accountId: Account['id']) {
		this.accountId = accountId
		this.binanceProxyToken = undefined
	}

	async getBinanceProxyApiActionHeaders() {
		const {accountId, binanceProxyApiActionHeaders} = this
		if (binanceProxyApiActionHeaders) return binanceProxyApiActionHeaders
		const session: ClientSession = {
			creationDay: today(),
			accountId
		}
		const token = await signSession(session)
		const headers = new ApiActionHeaders()
		headers.appendAuthorization(token)
		this.binanceProxyApiActionHeaders = headers
		return headers
	}

	async account(): Promise<BinanceAccountInformation> {
		throw new Error('TODO')
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

	async binanceProxyApiAction<Output extends SerializableData>({type, data: inputData}: ApiActionInput<BinanceProxyApiActionType>) {
		const headers = await this.getBinanceProxyApiActionHeaders()
		const options = apiActionRequestInit<BinanceProxyApiActionType>({type, headers, data: inputData})
		const endpoint = 'TODO'
		const response = await fetch(endpoint, options)
		if (response.ok) {
			const {data: outputData} = await response.json()
			return outputData as Output
		} else {
			const {error} = await response.json()
			return error
		}
	}

	async newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	): Promise<BinanceOrderRespFULL> {
		return this.binanceProxyApiAction<BinanceOrderRespFULL>({type: "CreateBinanceOrder", data: {symbol, side, type, orderOptions}})
	}

	symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
		return this.publicClient.symbolInfo(symbol)
	}

	async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
		return this.publicClient.tickerPrice(symbol)
	}
}
