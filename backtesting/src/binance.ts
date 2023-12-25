import {
	BinanceConnector,
	BinanceExchange,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceTickerPrice
} from "@workspace/binance"
import { DflowBinanceClient, DflowBinanceKlineInterval } from "@workspace/dflow"
import { div, mul } from "arithmetica"
import { now, Time } from "minimal-time-helpers"

export class BacktestingBinanceClient
	extends BinanceExchange
	implements DflowBinanceClient
{
	/** The session's scheduling `interval`. It is needed to manage cache. */
	interval: DflowBinanceKlineInterval

	/** The `time` used by simulated run. It is needed to manage cache. */
	time: Time = now()

	constructor(interval: BacktestingBinanceClient["interval"]) {
		super(BinanceConnector.defaultBaseUrl)
		this.interval = interval
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
		const { klinesCache: cache, interval, time } = this
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
		// If no data was found in cache, fetch it from Binance API.
		const klines = await super.klines(symbol, interval, {
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
