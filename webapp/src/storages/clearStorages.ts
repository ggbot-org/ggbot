import { binanceIDB, errorsIDB, ordersIDB } from "_/storages/indexedDBs"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"

export function clearStorages() {
	binanceIDB.deleteDatabase()
	errorsIDB.deleteDatabase()
	ordersIDB.deleteDatabase()
	localWebStorage.clearAnyThingButDebugFlags()
	sessionWebStorage.clear()
}
