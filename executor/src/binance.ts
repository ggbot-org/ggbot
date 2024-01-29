import {
	ApiActionHeaders,
	ApiActionInput,
	apiActionRequestInit,
	BinanceClientActionType,
	isApiActionOutputData,
	isApiActionOutputError
} from "@workspace/api"
import { signSession } from "@workspace/authentication"
import {
	BinanceConnector,
	BinanceExchange,
	BinanceKlineInterval,
	BinanceKlineOptionalParameters,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	ErrorBinanceHTTP
} from "@workspace/binance"
import { DflowBinanceClient } from "@workspace/dflow"
import { ENV } from "@workspace/env"
import { BadGatewayError, InternalServerError } from "@workspace/http"
import { BinanceProxyURLs } from "@workspace/locators"
import { Account, ClientSession, SerializableData } from "@workspace/models"
import { today } from "minimal-time-helpers"

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
	readonly accountId: Account["id"]
	binanceProxyApiActionHeaders: ApiActionHeaders | undefined
	readonly binanceProxy = new BinanceProxyURLs(ENV.BINANCE_PROXY_ORIGIN())
	readonly publicClient = new BinanceExchange(BinanceConnector.defaultBaseUrl)

	// TODO Also no need to pass apiKey and apiSecret here, needs accountId to pass it to authentication header
	constructor(accountId: Account["id"]) {
		this.accountId = accountId
	}

	async getBinanceClientActionHeaders() {
		const { accountId, binanceProxyApiActionHeaders } = this
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

	async binanceClientAction<Output extends SerializableData>({
		type,
		data: inputData
	}: ApiActionInput<BinanceClientActionType>) {
		const headers = await this.getBinanceClientActionHeaders()
		const options = apiActionRequestInit<BinanceClientActionType>({
			type,
			headers,
			data: inputData
		})
		const response = await fetch(this.binanceProxy.action, options)
		const output: unknown = await response.json()

		if (response.ok) {
			if (!isApiActionOutputData(output)) throw new BadGatewayError()

			return output.data as Output
		}

		if (isApiActionOutputError(output)) {
			const { error } = output
			if (error.name === ErrorBinanceHTTP.errorName) {
				throw new ErrorBinanceHTTP(
					error.info as ErrorBinanceHTTP["info"]
				)
			}
		}

		throw new InternalServerError()
	}

	candles(symbol: string, interval: BinanceKlineInterval, limit: number) {
		return this.publicClient.klines(symbol, interval, { limit })
	}

	exchangeInfo() {
		return this.publicClient.exchangeInfo()
	}

	klines(
		symbol: string,
		interval: BinanceKlineInterval,
		optionalParameters: BinanceKlineOptionalParameters
	) {
		return this.publicClient.klines(symbol, interval, optionalParameters)
	}

	async newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	) {
		return this.binanceClientAction<BinanceOrderRespFULL>({
			type: "CreateBinanceOrder",
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
