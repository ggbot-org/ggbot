import { binanceIDB } from "_/storages/binanceIDB"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"

export const clearStorages = () => {
	binanceIDB.deleteDatabase()
	localWebStorage.clearAnyThingButDebugFlags()
	sessionWebStorage.clear()
}
