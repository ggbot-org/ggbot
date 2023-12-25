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
		let quantity = options.quantity ?? "0"
		const quoteOrderQty = Number(options.quoteOrderQty)
		// TODO
		// it was
		// div(quoteOrderQty/price)
		// why it does not work if quoteOrderQty is 0.1 ?
		// it blocks everything
		// TODO by the way if order is below 10 dollars it should not execute.
		if (!isNaN(quoteOrderQty))
			quantity = String(quoteOrderQty / Number(price))

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
		return order
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
