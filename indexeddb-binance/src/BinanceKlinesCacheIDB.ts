import {
	BinanceKline,
	BinanceKlineInterval,
	binanceKlineKey,
	BinanceKlinesCacheProvider,
} from '@workspace/binance'

import { BinanceIDB } from './BinanceIDB.js'

export class BinanceKlinesCacheIDB implements BinanceKlinesCacheProvider {
	binanceIDB: BinanceIDB

	constructor(binanceIDB: BinanceIDB) {
		this.binanceIDB = binanceIDB
	}

	getKline(
		symbol: string,
		interval: BinanceKlineInterval,
		time: number
	): Promise<BinanceKline | undefined> {
		return this.binanceIDB.readKline(binanceKlineKey(symbol, interval, time))
	}

	setKline(
		symbol: string,
		interval: BinanceKlineInterval,
		kline: BinanceKline
	): Promise<void> {
		return this.binanceIDB.writeKline(
			binanceKlineKey(symbol, interval, kline[0]),
			kline
		)
	}
}
