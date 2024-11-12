import { ActionInput, BadGatewayError, BinanceClientActionType, clientAction, ClientActionHeaders, isApiActionOutputData, isApiActionOutputError } from '@workspace/api'
import { signSession } from '@workspace/authentication'
import { BinanceConnector, BinanceExchange, BinanceKlineInterval, BinanceKlineOptionalParameters, BinanceNewOrderOptions, BinanceOrder, BinanceOrderSide, BinanceOrderType, ErrorBinanceHTTP, isErrorBinanceHTTPInfo } from '@workspace/binance'
import { DflowBinanceClient } from '@workspace/dflow'
import { ENV } from '@workspace/env'
import { BinanceProxyURLs } from '@workspace/locators'
import { Account, ClientSession, SerializableData } from '@workspace/models'
import { today } from 'minimal-time-helpers'

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
	binanceProxyApiActionHeaders: ClientActionHeaders | undefined
	readonly binanceProxy = new BinanceProxyURLs(ENV.BINANCE_PROXY_IP())
	readonly publicClient = new BinanceExchange(BinanceConnector.defaultBaseUrl)

	constructor(accountId: Account['id']) {
		this.accountId = accountId
	}

	async getBinanceClientActionHeaders() {
		const { accountId, binanceProxyApiActionHeaders } = this
		if (binanceProxyApiActionHeaders) return binanceProxyApiActionHeaders
		const session: ClientSession = { creationDay: today(), accountId }
		const token = await signSession(session)
		const headers = new ClientActionHeaders()
		headers.appendAuthorization(token)
		this.binanceProxyApiActionHeaders = headers
		return headers
	}

	async binanceClientAction<Output extends SerializableData>({ type, data: inputData }: ActionInput<BinanceClientActionType>) {
		const headers = await this.getBinanceClientActionHeaders()

		const output = await clientAction(this.binanceProxy.action, headers, { type, data: inputData })

		if (isApiActionOutputData(output)) return output.data as Output

		if (isApiActionOutputError(output)) {
			const { error: { info } } = output
			if (isErrorBinanceHTTPInfo(info)) throw new ErrorBinanceHTTP(info)
		}

		// Fallback to throw a "Bad Gateway", notice it should not arrive here.
		throw new BadGatewayError()
	}

	candles(symbol: string, interval: BinanceKlineInterval, limit: number) {
		return this.publicClient.klines(symbol, interval, { limit })
	}

	exchangeInfo() {
		return this.publicClient.exchangeInfo()
	}

	klines(symbol: string, interval: BinanceKlineInterval, optionalParameters: BinanceKlineOptionalParameters) {
		return this.publicClient.klines(symbol, interval, optionalParameters)
	}

	async newOrder(symbol: string, side: BinanceOrderSide, type: Extract<BinanceOrderType, 'MARKET'>, orderOptions: BinanceNewOrderOptions) {
		return this.binanceClientAction<BinanceOrder>({
			type: 'CreateBinanceOrder',
			data: { symbol, side, type, orderOptions }
		})
	}

	symbolInfo(symbol: string) {
		return this.publicClient.symbolInfo(symbol)
	}

	async tickerPrice(symbol: string) {
		return this.publicClient.tickerPrice(symbol)
	}
}
