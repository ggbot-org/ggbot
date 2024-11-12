import { createHmac } from 'node:crypto'

import { balanceIsNotEmpty, BinanceAccountInformation, BinanceApiKeyPermission, BinanceApiPrivateEndpoint, BinanceApiRequestMethod, BinanceApiRequestParams, BinanceConnector, BinanceExchange, BinanceExchangeInfoCacheMap, BinanceNewOrderOptions, BinanceOrder, BinanceOrderSide, BinanceOrderType } from '@workspace/binance'

const exchangeInfoCache = new BinanceExchangeInfoCacheMap()

/**
 * BinanceClient implements private and public Binance API requests.
 *
 * @remarks
 * Binance restricts _Spot & Margin Trading_ APIs to trusted IPs only.
 * Notice that the _trusted IP_ must be configured on the Binance account
 * for the given `apiKey` provided as parameter to the constructor.
 */
export class BinanceClient {
	readonly apiSecret: string
	readonly connector: BinanceConnector
	readonly exchange: BinanceExchange

	constructor(apiKey: string, apiSecret: string, apiBaseUrl?: string) {
		const connector = new BinanceConnector(apiBaseUrl)
		connector.apiKey = apiKey
		this.connector = connector
		this.apiSecret = apiSecret
		this.exchange = new BinanceExchange(BinanceConnector.defaultBaseUrl)
		this.exchange.exchangeInfoCache = exchangeInfoCache
	}

	async privateRequest<Data>(
		method: BinanceApiRequestMethod,
		endpoint: BinanceApiPrivateEndpoint,
		params?: BinanceApiRequestParams
	) {
		const searchParams = new URLSearchParams()
		if (params) for (const [key, value] of Object.entries(params)) searchParams.append(key, String(value))

		searchParams.append('timestamp', String(Date.now()))

		searchParams.append(
			'signature',
			createHmac('sha256', this.apiSecret).update(searchParams.toString()).digest('hex')
		)

		return await this.connector.request<Data>(method, endpoint, Object.fromEntries(searchParams))
	}

	/**
	 * Account Information (USER_DATA)
	 *
	 * @see {@link https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data}
	 */
	async account(): Promise<BinanceAccountInformation> {
		const { balances, ...rest } = await this.privateRequest<BinanceAccountInformation>('GET', '/api/v3/account')

		return {
			// Filter empty balances
			balances: balances.filter(balanceIsNotEmpty),
			...rest
		}
	}

	async apiRestrictions(): Promise<BinanceApiKeyPermission> {
		return this.privateRequest<BinanceApiKeyPermission>('GET', '/sapi/v1/account/apiRestrictions')
	}

	/**
	 * Send in a new order.
	 *
	 * @see {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
	 */
	async newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, 'MARKET'>,
		orderOptions: BinanceNewOrderOptions
	): Promise<BinanceOrder> {
		const options = await this.exchange.prepareOrder(symbol, type, orderOptions)
		return await this.privateRequest<BinanceOrder>('POST', '/api/v3/order', { symbol, side, type, ...options })
	}
}
