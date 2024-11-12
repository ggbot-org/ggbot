import { DflowCommonContext } from '../common/context.js'
import { DflowBinanceClient } from './client.js'

export type DflowBinanceContext = DflowCommonContext & {
	binance: DflowBinanceClient
}
