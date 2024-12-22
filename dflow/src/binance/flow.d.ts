import { StrategyFlowGraph } from '@workspace/models'
import { DflowNodesCatalog } from 'dflow'

import { DflowParameter } from '../common/parameters'
import { DflowBinanceContext as Context } from './context'
import { DflowBinanceSymbolAndInterval, DflowBinanceSymbolInfo } from './symbols'

export declare function extractBinanceParametersFromFlow(binanceSymbols: DflowBinanceSymbolInfo[], graph: StrategyFlowGraph): Promise<DflowParameter[]>

export declare function extractBinanceSymbolsAndIntervalsFromFlow(binanceSymbols: DflowBinanceSymbolInfo[], graph: StrategyFlowGraph): Promise<DflowBinanceSymbolAndInterval[]>

export declare function extractsBinanceDefaultsFromFlow(nodesCatalog: DflowNodesCatalog, graph: StrategyFlowGraph): Promise<Context['defaults']>

export declare function extractsBinanceSymbolsFromFlow(binanceSymbols: DflowBinanceSymbolInfo[], graph: StrategyFlowGraph): Promise<string[]>
