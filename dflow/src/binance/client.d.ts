import { BinanceExchangeInfo, BinanceKline, BinanceKlineOptionalParameters, BinanceNewOrderOptions, BinanceOrder, BinanceOrderSide, BinanceOrderType, BinanceSymbolInfo, BinanceTickerPrice } from '@workspace/binance'

import { DflowBinanceKlineInterval } from './klineIntervals'

/** Binance API used by dflow binance nodes. */
export type DflowBinanceClient = DflowBinanceClientPublic & DflowBinanceClientPrivate

/** Binance Public API used by dflow binance nodes. */
type DflowBinanceClientPublic = {
	exchangeInfo(): Promise<BinanceExchangeInfo>;
	klines(symbol: string, interval: DflowBinanceKlineInterval, optionalParameters: BinanceKlineOptionalParameters): Promise<BinanceKline[]>;
	symbolInfo(symbol: string): Promise<BinanceSymbolInfo | undefined>;
	tickerPrice(symbol: string): Promise<BinanceTickerPrice>;
}

/** Binance Private API used by dflow binance nodes. */
type DflowBinanceClientPrivate = {
	newOrder(symbol: string, side: BinanceOrderSide, type: Extract<BinanceOrderType, 'MARKET'>, orderOptions: BinanceNewOrderOptions): Promise<BinanceOrder | undefined>;
}

export declare class DflowBinanceClientDummy implements DflowBinanceClient {
	exchangeInfo(): Promise<BinanceExchangeInfo>
	klines(_symbol: string, _interval: DflowBinanceKlineInterval, _optionalParameters: BinanceKlineOptionalParameters): Promise<BinanceKline[]>
	newOrder(symbol: string, side: BinanceOrderSide, type: Extract<BinanceOrderType, 'MARKET'>, _orderOptions: BinanceNewOrderOptions): Promise<BinanceOrder>
	symbolInfo(_symbol: string): Promise<BinanceSymbolInfo | undefined>
	tickerPrice(symbol: string): Promise<BinanceTickerPrice>
}
