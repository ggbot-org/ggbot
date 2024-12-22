import { DflowCommonContext } from '../common/context'
import { DflowBinanceClient } from './client'

export type DflowBinanceContext = DflowCommonContext & {
	binance: DflowBinanceClient;
}
