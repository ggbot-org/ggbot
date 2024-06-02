import {
	BinanceConnector,
	BinanceExchange,
	BinanceExchangeInfo,
	BinanceKline,
	BinanceKlineOptionalParameters,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceSymbolInfo,
	BinanceTickerPrice,
	div,
	mul
} from "@workspace/binance"
import {
	DflowBinanceClient,
	DflowBinanceKlineInterval,
	dflowBinanceZero
} from "@workspace/dflow"
import { now, Time } from "minimal-time-helpers"

import { ErrorCannotCreateOrder } from "./errors.js"

let orderId = 0

export class BacktestingBinanceClient implements DflowBinanceClient {
	readonly publicClient = new BinanceExchange(BinanceConnector.defaultBaseUrl)
	/** The `schedulingInterval` is needed to manage cache. */
	schedulingInterval: DflowBinanceKlineInterval

	/** The `time` used by simulated run. It is needed to manage cache. */
	time: Time = now()

	constructor(
		schedulingInterval: BacktestingBinanceClient["schedulingInterval"]
	) {
		this.schedulingInterval = schedulingInterval
	}

	exchangeInfo(): Promise<BinanceExchangeInfo> {
		return this.publicClient.exchangeInfo()
	}

	klines(
		symbol: string,
		interval: DflowBinanceKlineInterval,
		optionalParameters: BinanceKlineOptionalParameters
	): Promise<BinanceKline[]> {
		return this.publicClient.klines(symbol, interval, optionalParameters)
	}

	async newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	) {
		const options = await this.publicClient.prepareOrder(
			symbol,
			type,
			orderOptions
		)
		const { price } = await this.tickerPrice(symbol)
		const symbolInfo = await this.publicClient.symbolInfo(symbol)
		if (!symbolInfo) throw new ErrorCannotCreateOrder()

		orderId++

		const { baseAssetPrecision, quoteAssetPrecision } = symbolInfo
		let { quantity: baseQuantity, quoteOrderQty: quoteQuantity } = options
		if (quoteQuantity && baseQuantity === undefined)
			baseQuantity = div(quoteQuantity, price, quoteAssetPrecision)
		if (baseQuantity && quoteQuantity === undefined)
			quoteQuantity = mul(baseQuantity, price, baseAssetPrecision)
		if (!baseQuantity) baseQuantity = dflowBinanceZero(baseAssetPrecision)
		if (!quoteQuantity)
			quoteQuantity = dflowBinanceZero(quoteAssetPrecision)

		return {
			clientOrderId: "",
			cummulativeQuoteQty: quoteQuantity,
			executedQty: baseQuantity,
			orderId,
			orderListId: -1,
			origQty: baseQuantity,
			price,
			side,
			status: "FILLED",
			symbol,
			timeInForce: "GTC",
			transactTime: this.time,
			type,

			fills: [
				{
					commission: "0",
					commissionAsset: "BNB",
					price,
					qty: baseQuantity,
					tradeId: orderId
				}
			]
		} satisfies BinanceOrderRespFULL
	}

	symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
		return this.publicClient.symbolInfo(symbol)
	}

	async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
		const klines = await this.publicClient.klines(
			symbol,
			this.schedulingInterval,
			{
				limit: 1,
				endTime: this.time
			}
		)
		return {
			symbol,
			// Since klines parameters are `limit` and `extends`,
			// price is kline's close.
			price: klines[0][4]
		}
	}
}
