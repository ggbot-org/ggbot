import { CacheObjectStore, IDBInstance, IDBProvider } from "@workspace/indexeddb"
import { Order, StrategyKey } from "@workspace/models"
import { Day } from "minimal-time-helpers"

export class OrdersIDB extends IDBProvider implements IDBInstance {
	readonly databaseName = "orders"
	readonly databaseVersion = 1

	private objectStore: CacheObjectStore

	constructor() {
		super()
		this.objectStore = new CacheObjectStore(this.databaseName, this.databaseVersion)
		super.open(this)
	}

	static dailyOrdersKey({ strategyId, strategyKind }: StrategyKey, day: Day) {
		return `${strategyKind}:${strategyId}/${day}`
	}

	databaseUpgrade(db: IDBDatabase, version: number) {
		if (version === 1) this.objectStore.create(db)
	}

	readDailyOrders(strategyKey: StrategyKey, day: Day): Promise<Order[] | undefined> {
		if (!this.db) return Promise.reject()
		return this.objectStore.read<Order[]>(this.db, OrdersIDB.dailyOrdersKey(strategyKey, day))
	}

	writeDailyOrders(strategyKey: StrategyKey, day: Day, data: Order[]): Promise<void> {
		if (!this.db) return Promise.reject()
		return this.objectStore.write<Order[]>(this.db, OrdersIDB.dailyOrdersKey(strategyKey, day), data)
	}
}
