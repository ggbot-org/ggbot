import { binanceDB } from "_/storages/binanceDB"
import { localWebStorage } from "_/storages/local"
import { sessionWebStorage } from "_/storages/session"
import { userDB } from "_/storages/userDB"

export const clearStorages = () => {
	userDB.deleteDatabase()
	binanceDB.deleteDatabase()
	localWebStorage.clear()
	sessionWebStorage.clear()
}
