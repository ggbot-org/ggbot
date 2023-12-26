import { div } from "@workspace/arithmetic"
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
	BinanceTickerPrice
} from "@workspace/binance"
import {
	DflowBinanceClient,
	DflowBinanceKlineInterval,
	dflowBinanceZero
} from "@workspace/dflow"
import { now, Time } from "minimal-time-helpers"

import { ErrorCannotCreateOrder } from "./errors.js"

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
		const { publicClient: binance } = this
		const options = await binance.prepareOrder(symbol, type, orderOptions)
		const { price } = await this.tickerPrice(symbol)
		const symbolInfo = await this.publicClient.symbolInfo(symbol)
		if (!symbolInfo) throw new ErrorCannotCreateOrder()

		const { baseAssetPrecision, quoteAssetPrecision } = symbolInfo
		const { quoteOrderQty } = options
		let quantity = options.quantity ?? dflowBinanceZero(baseAssetPrecision)
		if (quoteOrderQty)
			quantity = div(quoteOrderQty, price, quoteAssetPrecision)

		return {
			clientOrderId: "",
			cummulativeQuoteQty: "0",
			executedQty: quantity,
			orderId: -1,
			orderListId: -1,
			origQty: quantity,
			price,
			side,
			status: "FILLED",
			symbol,
			timeInForce: "GTC",
			transactTime: 0,
			type,

			fills: [
				{
					commission: "0",
					commissionAsset: "BNB",
					price,
					qty: quantity,
					tradeId: -1
				}
			]
		} satisfies BinanceOrderRespFULL
	}

	symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined> {
		return this.publicClient.symbolInfo(symbol)
	}

	async tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
		const {
			publicClient: binance,
			schedulingInterval: interval,
			time
		} = this
		const { klinesCache: cache } = binance
		// Look for cached data.
		if (cache) {
			const kline = await cache.getKline(symbol, interval, time)
			if (kline)
				return {
					symbol,
					// Price is kline's open.
					price: kline[1]
				}
		}
		// // If no data was found in cache, fetch it from Binance API.
		const klines = await binance.klines(symbol, interval, {
			limit: 1,
			endTime: time
		})
		return {
			symbol,
			// Since klines parameters are `limit` and `extends`,
			// price is kline's close.
			price: klines[0][4]
		}
	}
}
