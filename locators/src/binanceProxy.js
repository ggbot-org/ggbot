export class BinanceProxyBaseURL extends URL {
	static port = 1221
	/** @param {string} origin */
	constructor(origin) {
		super(`http://${origin}:${BinanceProxyBaseURL.port}`)
	}
}

export class BinanceProxyURLs {
	/** @param {string} origin */
	constructor(origin) {
		this.baseURL = new BinanceProxyBaseURL(origin)
	}

	get action() {
		return new URL('action', this.baseURL)
	}
}
