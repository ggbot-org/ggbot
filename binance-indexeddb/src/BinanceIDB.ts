import { BinanceExchangeInfo, BinanceKline } from "@workspace/binance"
import {
	CacheObjectStore,
	IDBInstance,
	IDBProvider
} from "@workspace/indexeddb"

export class BinanceIDB extends IDBProvider implements IDBInstance {
	readonly databaseName: string
	readonly databaseVersion: number

	private objectStore: CacheObjectStore

	static exchangeInfoKey = "exchangeInfo"

	static klineKey(key: string) {
		return `kline/${key}`
	}

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

	databaseUpgrade(db: IDBDatabase, version: number) {
		if (version === 1) {
			this.objectStore.create(db)
		}
	}

	deleteExchangeInfo(): Promise<void> {
		const { db, objectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.delete(db, BinanceIDB.exchangeInfoKey)
	}

	deleteKline(): Promise<void> {
		const { db, objectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.delete(db, BinanceIDB.exchangeInfoKey)
	}

	readExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		const { db, objectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.read<BinanceExchangeInfo>(
			db,
			BinanceIDB.exchangeInfoKey
		)
	}

	readKline(_key: string): Promise<BinanceKline | undefined> {
		const { db } = this
		if (!db) return Promise.reject()
		return Promise.resolve(undefined)
	}

	writeExchangeInfo(data: BinanceExchangeInfo): Promise<void> {
		const { db, objectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.write<BinanceExchangeInfo>(
			db,
			BinanceIDB.exchangeInfoKey,
			data
		)
	}

	writeKline(key: string, data: BinanceKline): Promise<void> {
		const { db, objectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.write<BinanceKline>(
			db,
			BinanceIDB.klineKey(key),
			data
		)
	}
}
