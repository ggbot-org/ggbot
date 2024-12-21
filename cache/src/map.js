export class CacheMap {

	itemMap = new Map()
	timeToLiveMap = new Map()
	whenUpdatedMap = new Map()

	/** @param {number} timeToLive */
	constructor(timeToLive) {
		this.timeToLive = timeToLive
	}

	/**
	 * @param {string} key
	 * @param {any} value
	 */
	set(key, value) {
		this.itemMap.set(key, value)
		if (this.timeToLive) this.whenUpdatedMap.set(key, Date.now())
	}

	/**
	 * @param {string} key
	 * @returns {any} value
	 */
	get(key) {
		if (!this.itemMap.has(key)) return
		// No `timeToLive` found means item is cached for ever.
		if (!this.timeToLive) return this.itemMap.get(key)
		// No `whenUpdated` found means it is not possible to know if it is up to date.
		const whenUpdated = this.whenUpdatedMap.get(key)
		// If is not up to date, delete item and return.
		if (!whenUpdated || (whenUpdated + this.timeToLive < Date.now())) {
			this.delete(key)
			return
		}
		return this.itemMap.get(key)
	}

	/** @param {string} key */
	delete(key) {
		this.itemMap.delete(key)
		this.timeToLiveMap.delete(key)
		this.whenUpdatedMap.delete(key)
	}
}
