import { BinanceExchangeInfo, BinanceSymbolInfo } from '@workspace/binance'

import { DflowBinanceKlineInterval } from './klineIntervals'

export type DflowBinanceSymbolInfo = Pick<BinanceSymbolInfo, 'baseAsset' | 'baseAssetPrecision' | 'baseCommissionPrecision' | 'filters' | 'isSpotTradingAllowed' | 'quoteAsset' | 'quoteAssetPrecision' | 'status' | 'symbol'>

export declare function binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(symbols: BinanceExchangeInfo['symbols']): DflowBinanceSymbolInfo[]

export declare const dflowBinanceSymbolSeparator = '/'

export declare function getDflowBinanceNodeSymbolKind({ baseAsset, quoteAsset }: Pick<BinanceSymbolInfo, 'baseAsset' | 'quoteAsset'>): string

export type DflowBinanceSymbolAndInterval = {
	symbol: string;
	interval: DflowBinanceKlineInterval;
}
