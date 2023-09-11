import { div, mul } from "@workspace/arithmetic"
import {
	BinanceAccountInformation,
	BinanceBalance,
	BinanceKline,
	BinanceKlineInterval,
	binanceKlineIntervals,
	BinanceKlinesCacheMap,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	getBinanceIntervalTime
} from "@workspace/binance"
import {
	BinanceDflowClient,
	BinanceDflowClientKlinesParameters,
	BinanceDflowSymbolAndInterval,
	DflowBinanceKlineInterval,
	dflowBinanceLowerKlineInterval,
	dflowBinancePrecision,
	dflowBinanceZero as zero
} from "@workspace/dflow"
import { Time } from "minimal-time-helpers"

import { binance } from "./exchange.js"

export class BinanceClient implements BinanceDflowClient {
	readonly balances: BinanceBalance[]

	readonly time: Time

	private readonly klinesCache: BinanceKlinesCacheMap

	/* Optional parameters used during backtesting preparation. */
	private readonly backtestingPreparation:
		| ({
				klinesParameters: BinanceDflowClientKlinesParameters
		  } & BinanceDflowSymbolAndInterval)
		| undefined

	constructor(
		{ balances, time }: Pick<BinanceClient, "balances" | "time">,
		klinesCache: BinanceClient["klinesCache"],
		backtestingPreparation?: BinanceClient["backtestingPreparation"]
	) {
		this.balances = balances
		this.time = time
		this.klinesCache = klinesCache
		this.backtestingPreparation = backtestingPreparation
	}

	async account() {
		const accountInfo: BinanceAccountInformation = {
			accountType: "SPOT",
			balances: this.balances,
			brokered: false,
			buyerCommission: 0,
			canDeposit: true,
			canTrade: true,
			canWithdraw: true,
			makerCommission: 15,
			permissions: ["SPOT"],
			sellerCommission: 0,
			takerCommission: 15,
			updateTime: 0
		}
		return Promise.resolve(accountInfo)
	}

	async klines(
		symbol: string,
		interval: BinanceKlineInterval,
		{ limit, endTime }: BinanceDflowClientKlinesParameters
	) {
		// Look for cached data.
		const { backtestingPreparation, klinesCache: cache } = this
		const cachedKlines: BinanceKline[] = []
		let time = getBinanceIntervalTime[interval](endTime).minus(limit)
		while (time < endTime) {
			const kline = cache.getKline(symbol, interval, time)
			if (!kline) break
			cachedKlines.push(kline)
			time = getBinanceIntervalTime[interval](time).plus(1)
		}
		// If all klines wanted are found in cache, it's done!
		if (cachedKlines.length === limit) return cachedKlines
		// If no data was found in cache, fetch it from Binance API.
		const klinesParameters = backtestingPreparation?.klinesParameters ?? {
			endTime,
			limit
		}
		const klines = await binance.klines(symbol, interval, klinesParameters)
		// Cache all klines found.
		for (const kline of klines) cache.setKline(symbol, interval, kline)
		// Return only klines asked by limit parameter.
		return klines.slice(-limit)
	}

	async exchangeInfo() {
		return await binance.exchangeInfo()
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
		let quantity = zero
		let quoteQuantity = zero
		if (options.quantity !== undefined) {
			quantity = options.quantity
			quoteQuantity = mul(quantity, price, dflowBinancePrecision)
		}
		if (options.quoteOrderQty !== undefined) {
			quoteQuantity = options.quoteOrderQty
			quantity = div(quoteQuantity, price, dflowBinancePrecision)
		}

		const order: BinanceOrderRespFULL = {
			clientOrderId: "",
			cummulativeQuoteQty: zero,
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
					commission: zero,
					commissionAsset: "BNB",
					price,
					qty: quantity,
					tradeId: -1
				}
			]
		}
		return Promise.resolve(order)
	}

	async isBinanceSymbol(arg: unknown) {
		return await binance.isBinanceSymbol(arg)
	}

	async tickerPrice(symbol: string) {
		const { backtestingPreparation, klinesCache: cache, time } = this
		// Look for cached data.
		for (const interval of binanceKlineIntervals) {
			const kline = cache.getKline(symbol, interval, time)
			if (kline)
				return {
					symbol,
					// Price is kline's open.
					price: kline[1]
				}
		}
		let interval: DflowBinanceKlineInterval = dflowBinanceLowerKlineInterval
		if (backtestingPreparation) {
			if (backtestingPreparation.symbol === symbol)
				interval = backtestingPreparation.interval
		}
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
