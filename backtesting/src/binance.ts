import {
	BinanceConnector,
	BinanceExchange,
	BinanceKline,
	BinanceKlineInterval,
	binanceKlineIntervals,
	BinanceKlinesCacheMap,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceTickerPrice,
	getBinanceIntervalTime
} from "@workspace/binance"
import {
	DflowBinanceClient,
	DflowBinanceClientKlinesParameters,
	DflowBinanceKlineInterval,
	dflowBinanceLowerKlineInterval
} from "@workspace/dflow"
import { div, mul } from "arithmetica"
import { Time } from "minimal-time-helpers"

export const binance = new BinanceExchange(BinanceConnector.defaultBaseUrl)

export class BacktestingBinanceClient implements DflowBinanceClient {
	readonly time: Time

	private readonly klinesCache: BinanceKlinesCacheMap | undefined

	constructor(time: Time) {
		this.time = time
	}

	async exchangeInfo() {
		return await binance.exchangeInfo()
	}

	async isBinanceSymbol(arg: unknown) {
		return await binance.isBinanceSymbol(arg)
	}

	async klines(
		symbol: string,
		interval: BinanceKlineInterval,
		{ limit, endTime }: DflowBinanceClientKlinesParameters
	) {
		// Look for cached data.
		const { klinesCache: cache } = this
		const cachedKlines: BinanceKline[] = []
		let time = getBinanceIntervalTime[interval](endTime).minus(limit)
		if (cache)
			while (time < endTime) {
				const kline = cache.getKline(symbol, interval, time)
				if (!kline) break
				cachedKlines.push(kline)
				time = getBinanceIntervalTime[interval](time).plus(1)
			}
		// If all klines wanted are found in cache, it's done!
		if (cachedKlines.length === limit) return cachedKlines
		// If no data was found in cache, fetch it from Binance API.
		const klines = await binance.klines(symbol, interval, {
			endTime,
			limit
		})
		// Cache all klines found.
		if (cache)
			for (const kline of klines) cache.setKline(symbol, interval, kline)
		// Return only klines asked by limit parameter.
		return klines.slice(-limit)
	}

	async newOrder(
		symbolInput: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	) {
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
		const { klinesCache: cache, time } = this
		// Look for cached data.
		if (cache)
			for (const interval of binanceKlineIntervals) {
				const kline = cache.getKline(symbol, interval, time)
				if (kline)
					return {
						symbol,
						// Price is kline's open.
						price: kline[1]
					}
			}
		const interval: DflowBinanceKlineInterval = dflowBinanceLowerKlineInterval
		// If no data was found in cache, fetch it from Binance API.
		const klines = await this.klines(symbol, interval, {
			limit: 1,
			endTime: time
		})
		return {
			symbol,
			// Price is kline's close. TODO is this correct? double check
			price: klines[0][4]
		}
	}
}
