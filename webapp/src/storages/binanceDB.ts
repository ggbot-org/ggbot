import { BinanceExchangeInfo } from "@workspace/binance"

import { CacheObjectStore, IDBInstance, IDBProvider } from "./IndexedDB.js"

type InfoSchema = {
	BinanceExchangeInfo: {
		type: "BinanceExchangeInfo"
		data: BinanceExchangeInfo
	}
}

class BinanceDB extends IDBProvider implements IDBInstance {
	readonly databaseName: string
	readonly databaseVersion: number

	private infoObjectStore: CacheObjectStore<InfoSchema>

	constructor() {
		super()
		this.databaseName = BinanceDB.databaseName()
		this.databaseVersion = 1
		this.infoObjectStore = new CacheObjectStore(
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
			this.infoObjectStore.create(db)
		}
	}

	readExchangeInfo(): Promise<BinanceExchangeInfo | undefined> {
		const { db, infoObjectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.read<InfoSchema["BinanceExchangeInfo"]["data"]>(
			db,
			"BinanceExchangeInfo"
		)
	}

	writeExchangeInfo(data: BinanceExchangeInfo): Promise<void> {
		const { db, infoObjectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.write<"BinanceExchangeInfo">(db, {
			type: "BinanceExchangeInfo",
			data
		})
	}
}

export const binanceDB = new BinanceDB()
