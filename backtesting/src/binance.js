import { BinanceConnector, BinanceExchange, div, mul } from '@workspace/binance'
import { dflowBinanceZero } from '@workspace/dflow'
import { now } from 'minimal-time-helpers'

/** @typedef {import('@workspace/dflow').DflowBinanceClient} DflowBinanceClient */

let orderId = 0

/** @implements {DflowBinanceClient} */
export class BacktestingBinanceClient {
	publicClient = new BinanceExchange(BinanceConnector.defaultBaseUrl)

	time = now()

	/** @param {import('@workspace/dflow').DflowBinanceKlineInterval} schedulingInterval */
	constructor(schedulingInterval) {
		this.schedulingInterval = schedulingInterval
	}

	/** @type {import('./binance').BacktestingBinanceClient['exchangeInfo']} */
	exchangeInfo() {
		return this.publicClient.exchangeInfo()
	}

	/** @type {import('./binance').BacktestingBinanceClient['klines']} */
	klines(symbol, interval, optionalParameters) {
		return this.publicClient.klines(symbol, interval, optionalParameters)
	}

	/** @type {import('./binance').BacktestingBinanceClient['newOrder']} */
	async newOrder(symbol, side, type, orderOptions) {
		const symbolInfo = await this.publicClient.symbolInfo(symbol)
		const options = await this.publicClient.prepareOrder(symbol, type, orderOptions)
		if (!options || !symbolInfo) {
			console.error('Cannot create order', side, symbol, orderOptions)
			return
		}
		const { price } = await this.tickerPrice(symbol)

		orderId++

		const { baseAssetPrecision, quoteAssetPrecision } = symbolInfo
		let { quantity: baseQuantity, quoteOrderQty: quoteQuantity } = options
		if (quoteQuantity && baseQuantity === undefined) baseQuantity = div(quoteQuantity, price, quoteAssetPrecision)
		if (baseQuantity && quoteQuantity === undefined) quoteQuantity = mul(baseQuantity, price, baseAssetPrecision)
		if (!baseQuantity) baseQuantity = dflowBinanceZero(baseAssetPrecision)
		if (!quoteQuantity) quoteQuantity = dflowBinanceZero(quoteAssetPrecision)

		/** @type {import('@workspace/binance').BinanceOrder} */
		return {
			executedQty: baseQuantity,
			orderId,
			price,
			side,
			status: 'FILLED',
			symbol,
			transactTime: this.time,
			type,
			fills: [
				{
					commission: '0',
					commissionAsset: 'BNB',
					price,
					qty: baseQuantity,
				}
			]
		}
	}

	/** @type {import('./binance').BacktestingBinanceClient['symbolInfo']} */
	symbolInfo(symbol) {
 		return this.publicClient.symbolInfo(symbol)
	}

	/** @type {import('./binance').BacktestingBinanceClient['tickerPrice']} */
	async tickerPrice(symbol) {
		const klines = await this.publicClient.klines(symbol, this.schedulingInterval, { limit: 1, endTime: this.time })
		return {
			symbol,
			// Since klines parameters are `limit` and `extends`,
			// price is kline's close.
			price: klines[0][4]
		}
	}
}
