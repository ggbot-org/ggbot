import { DflowNodesCatalog } from 'dflow'

import { DflowBinanceSymbolInfo } from './symbols'

/**
 * Creates a dynamic set of dflow nodes generated according to Binance definitions.
 */
export declare function getDflowBinanceDynamicNodesCatalog(symbols: DflowBinanceSymbolInfo[]): DflowNodesCatalog

export declare function getDflowBinanceNodesCatalog(symbols: DflowBinanceSymbolInfo[]): DflowNodesCatalog
