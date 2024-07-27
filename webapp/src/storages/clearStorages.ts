import { binanceIDB } from "_/storages/binanceIDB"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"

export function clearStorages() {
	binanceIDB.deleteDatabase()
	localWebStorage.clearAnyThingButDebugFlags()
	sessionWebStorage.clear()
}
