import { BinanceExchangeInfo, BinanceKline } from "@workspace/binance"
import {
	CacheObjectStore,
	IDBInstance,
	IDBProvider
} from "@workspace/indexeddb"

export class BinanceIDB extends IDBProvider implements IDBInstance {
	static exchangeInfoKey = "exchangeInfo"

	readonly databaseName: string
	readonly databaseVersion: number

	private objectStore: CacheObjectStore

	constructor() {
		super()
		this.databaseName = BinanceIDB.databaseName()
		this.databaseVersion = 1
		this.objectStore = new CacheObjectStore(
			this.databaseName,
			this.databaseVersion
		)
		super.open(this)
	}

	static databaseName() {
		return "binance"
	}

	static klineKey(key: string) {
		return `kline/${key}`
	}

	databaseUpgrade(db: IDBDatabase, version: number) {
		if (version === 1) {
			this.objectStore.create(db)
		}
	}

	deleteExchangeInfo(): Promise<void> {
		if (!this.db) return Promise.reject()
		return this.objectStore.delete(this.db, BinanceIDB.exchangeInfoKey)
	}

	deleteKline(): Promise<void> {
		if (!this.db) return Promise.reject()
		return this.objectStore.delete(this.db, BinanceIDB.exchangeInfoKey)
	}

	readExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		if (!this.db) return Promise.reject()
		return this.objectStore.read<BinanceExchangeInfo>(
			this.db,
			BinanceIDB.exchangeInfoKey
		)
	}

	readKline(key: string): Promise<BinanceKline | undefined> {
		if (!this.db) return Promise.reject()
		return this.objectStore.read<BinanceKline>(
			this.db,
			BinanceIDB.klineKey(key)
		)
	}

	writeExchangeInfo(data: BinanceExchangeInfo): Promise<void> {
		if (!this.db) return Promise.reject()
		return this.objectStore.write<BinanceExchangeInfo>(
			this.db,
			BinanceIDB.exchangeInfoKey,
			data
		)
	}

	writeKline(key: string, data: BinanceKline): Promise<void> {
		if (!this.db) return Promise.reject()
		return this.objectStore.write<BinanceKline>(
			this.db,
			BinanceIDB.klineKey(key),
			data
		)
	}
}
