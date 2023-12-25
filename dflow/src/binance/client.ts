import {
	BinanceExchangeInfo,
	BinanceKline,
	BinanceKlineOptionalParameters,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceTickerPrice
} from "@workspace/binance"

import { DflowBinanceKlineInterval } from "./klineIntervals.js"

/** Binance API used by dflow binance nodes. */
export interface DflowBinanceClient
	extends DflowBinanceClientPublic,
		DflowBinanceClientPrivate {}

/** Binance Public API used by dflow binance nodes. */
interface DflowBinanceClientPublic {
	exchangeInfo(): Promise<BinanceExchangeInfo>
	isBinanceSymbol(arg: unknown): Promise<boolean>
	klines(
		symbol: string,
		interval: DflowBinanceKlineInterval,
		optionalParameters: BinanceKlineOptionalParameters
	): Promise<BinanceKline[]>
	tickerPrice(symbol: string): Promise<BinanceTickerPrice>
}

/** Binance Private API used by dflow binance nodes. */
interface DflowBinanceClientPrivate {
	newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		orderOptions: BinanceNewOrderOptions
	): Promise<BinanceOrderRespFULL>
}

export class DflowBinanceClientDummy implements DflowBinanceClient {
	async exchangeInfo(): Promise<BinanceExchangeInfo> {
		return Promise.resolve({
			timezone: "UTC",
			serverTime: 0,
			rateLimits: [],
			symbols: []
		})
	}

	isBinanceSymbol(_arg: unknown): Promise<boolean> {
		return Promise.resolve(false)
	}

	klines(
		_symbol: string,
		_interval: DflowBinanceKlineInterval,
		_optionalParameters: BinanceKlineOptionalParameters
	): Promise<BinanceKline[]> {
		return Promise.resolve([])
	}

	newOrder(
		symbol: string,
		side: BinanceOrderSide,
		type: Extract<BinanceOrderType, "MARKET">,
		_orderOptions: BinanceNewOrderOptions
	): Promise<BinanceOrderRespFULL> {
		return Promise.resolve({
			clientOrderId: "",
			cummulativeQuoteQty: "0",
			executedQty: "0",
			fills: [
				{
					commission: "0",
					commissionAsset: "BNB",
					price: "0",
					qty: "0",
					tradeId: -1
				}
			],
			orderId: -1,
			orderListId: -1,
			origQty: "0",
			price: "0",
			side,
			status: "FILLED",
			symbol,
			timeInForce: "GTC",
			transactTime: 0,
			type
		})
	}

	tickerPrice(symbol: string): Promise<BinanceTickerPrice> {
		return Promise.resolve({ symbol, price: "0" })
	}
}
