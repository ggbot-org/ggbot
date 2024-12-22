import { BinanceOrder } from '@workspace/binance'
import { Balance } from '@workspace/models'
import { DflowExecutionReport } from 'dflow'

import { DflowBinanceSymbolInfo } from './symbols'

export declare function getBalanceFromExecutionSteps(binanceSymbols: DflowBinanceSymbolInfo[], steps: DflowExecutionReport['steps']): Balance

export declare function getOrdersFromExecutionSteps(steps: DflowExecutionReport['steps']): BinanceOrder[]
