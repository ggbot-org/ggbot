import { DflowBinanceClientDummy } from '../client.js'
import { exchangeInfo } from './exchangeInfo.js'
import { kline } from './klines.js'

export class DflowBinanceClientMock extends DflowBinanceClientDummy {
	async exchangeInfo() {
		return Promise.resolve(exchangeInfo)
	}

	async klines() {
		return Promise.resolve([kline])
	}
}
