import {
	BinanceConnector,
	BinanceExchange,
	BinanceKlineInterval,
	binanceKlineIntervals,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceTickerPrice
} from "@workspace/binance"
import {
	DflowBinanceClient,
	DflowBinanceClientKlinesParameters,
	DflowBinanceKlineInterval,
	dflowBinanceLowerKlineInterval
} from "@workspace/dflow"
import { div, mul } from "arithmetica"
import { Time } from "minimal-time-helpers"

import { ErrorBacktestingBinanceClientUndefinedTime } from "./errors.js"

export class BacktestingBinanceClient
	extends BinanceExchange
	implements DflowBinanceClient
{
	time: Time | undefined

	constructor() {
		super(BinanceConnector.defaultBaseUrl)
	}

	async klines(
		symbol: string,
		interval: BinanceKlineInterval,
		optionalParameters: DflowBinanceClientKlinesParameters
	) {
		return super.klines(symbol, interval, optionalParameters)
	}

	async newOrder(
		symbolInput: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	) {
		const { options, symbol } = await super.prepareOrder(
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
		if (!time) throw new ErrorBacktestingBinanceClientUndefinedTime()
		// Look for cached data.
		if (cache)
			for (const interval of binanceKlineIntervals) {
				const kline = await cache.getKline(symbol, interval, time)
				if (kline)
					return {
						symbol,
						// Price is kline's open.
						price: kline[1]
					}
			}
		const interval: DflowBinanceKlineInterval =
			dflowBinanceLowerKlineInterval
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
