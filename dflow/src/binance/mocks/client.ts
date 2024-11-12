import { BinanceKline, BinanceKlineInterval, BinanceKlineOptionalParameters } from '@workspace/binance'

import { DflowBinanceClient, DflowBinanceClientDummy } from '../client.js'
import { exchangeInfo } from './exchangeInfo.js'
import { kline } from './klines.js'

export class DflowBinanceClientMock extends DflowBinanceClientDummy implements DflowBinanceClient {
	async exchangeInfo() {
		return Promise.resolve(exchangeInfo)
	}

	async klines(_symbol: string, _interval: BinanceKlineInterval, _optionalParameters: BinanceKlineOptionalParameters): Promise<BinanceKline[]> {
		return Promise.resolve([kline])
	}
}
