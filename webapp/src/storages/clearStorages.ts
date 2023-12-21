import { binanceDB } from "_/storages/binanceDB"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"

export const clearStorages = () => {
	binanceDB.deleteDatabase()
	localWebStorage.clear()
	sessionWebStorage.clear()
}
