export type WebStorageProvider = Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear">

export class LocalWebStorageProvider implements WebStorageProvider {
	getItem(key: string) {
		return localStorage.getItem(key)
	}
	setItem(key: string, value: string) {
		return localStorage.setItem(key, value)
	}
	removeItem(key: string) {
		return localStorage.removeItem(key)
	}
	clear() {
		localStorage.clear()
	}
}

export class SessionWebStorageProvider implements WebStorageProvider {
	getItem(key: string) {
		return sessionStorage.getItem(key)
	}
	setItem(key: string, value: string) {
		sessionStorage.setItem(key, value)
	}
	removeItem(key: string) {
		sessionStorage.removeItem(key)
	}
	clear() {
		sessionStorage.clear()
	}
}
