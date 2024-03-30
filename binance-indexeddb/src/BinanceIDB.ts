import { BinanceExchangeInfo } from "@workspace/binance"
import {
	CacheObjectStore,
	IDBInstance,
	IDBProvider
} from "@workspace/indexeddb"

type InfoSchema = {
	BinanceExchangeInfo: {
		type: "BinanceExchangeInfo"
		data: BinanceExchangeInfo
	}
}

export class BinanceIDB extends IDBProvider implements IDBInstance {
	readonly databaseName: string
	readonly databaseVersion: number

	private infoObjectStore: CacheObjectStore<InfoSchema>

	constructor() {
		super()
		this.databaseName = BinanceIDB.databaseName()
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

	deleteExchangeInfo(): Promise<void> {
		const { db, infoObjectStore: objectStore } = this
		if (!db) return Promise.reject()
		return objectStore.delete(db, "BinanceExchangeInfo")
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
