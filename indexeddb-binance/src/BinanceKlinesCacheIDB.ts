import { BinanceKline, BinanceKlineInterval, binanceKlineKey, BinanceKlinesCacheProvider } from "@workspace/binance"

import { BinanceIDB } from "./BinanceIDB.js"

export class BinanceKlinesCacheIDB implements BinanceKlinesCacheProvider {
	private binanceIDB: BinanceIDB

	constructor(binanceIDB: BinanceKlinesCacheIDB["binanceIDB"]) {
		this.binanceIDB = binanceIDB
	}

	getKline(symbol: string, interval: BinanceKlineInterval, time: number): Promise<BinanceKline | undefined> {
		const key = binanceKlineKey(symbol, interval, time)
		return this.binanceIDB.readKline(key)
	}

	setKline(symbol: string, interval: BinanceKlineInterval, kline: BinanceKline): Promise<void> {
		const key = binanceKlineKey(symbol, interval, kline[0])
		return this.binanceIDB.writeKline(key, kline)
	}
}
