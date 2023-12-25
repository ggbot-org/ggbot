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
	BinanceTickerPrice
} from "@workspace/binance"
import { DflowBinanceClient, DflowBinanceKlineInterval } from "@workspace/dflow"
import { div, mul } from "arithmetica"
import { now, Time } from "minimal-time-helpers"

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

	isBinanceSymbol(arg: unknown): Promise<boolean> {
		return this.publicClient.isBinanceSymbol(arg)
	}

	klines(
		symbol: string,
		interval: DflowBinanceKlineInterval,
		optionalParameters: BinanceKlineOptionalParameters
	): Promise<BinanceKline[]> {
		return this.publicClient.klines(symbol, interval, optionalParameters)
	}

	async newOrder(
		symbolInput: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	) {
		const { publicClient: binance } = this
		const { options, symbol } = await binance.prepareOrder(
			symbolInput,
			side,
			type,
			orderOptions
		)
		const { price } = await this.tickerPrice(symbol)
		let quantity = "0"
		let quoteQuantity = "0"
		if (options.quantity !== undefined) {
			quantity = options.quantity
			quoteQuantity = mul(quantity, price)
		}
		if (options.quoteOrderQty !== undefined) {
			quoteQuantity = options.quoteOrderQty
			quantity = div(quoteQuantity, price)
		}

		const order: BinanceOrderRespFULL = {
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
		}
		return Promise.resolve(order)
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
