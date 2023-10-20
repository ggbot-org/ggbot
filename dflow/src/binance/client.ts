import {
	BinanceExchangeInfo,
	BinanceKline,
	BinanceKlineInterval,
	BinanceKlineOptionalParameters,
	BinanceNewOrderOptions,
	BinanceOrderRespFULL,
	BinanceOrderSide,
	BinanceOrderType,
	BinanceTickerPrice
} from "@workspace/binance"

/** Binance API used by dflow binance nodes. */
export interface DflowBinanceClient
	extends DflowBinanceClientPublic,
		DflowBinanceClientPrivate {}

export type DflowBinanceClientKlinesParameters = Required<
	Pick<BinanceKlineOptionalParameters, "endTime" | "limit">
>

/** Binance Public API used by dflow binance nodes. */
interface DflowBinanceClientPublic {
	exchangeInfo(): Promise<BinanceExchangeInfo>
	isBinanceSymbol(arg: unknown): Promise<boolean>
	klines(
		symbol: string,
		interval: BinanceKlineInterval,
		parameters: DflowBinanceClientKlinesParameters
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
