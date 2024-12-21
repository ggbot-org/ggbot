export class BinanceProxyBaseURL extends URL {
	static port = 1221
	constructor(origin) {
		super(`http://${origin}:${BinanceProxyBaseURL.port}`)
	}
}

export class BinanceProxyURLs {
	constructor(origin) {
		this.baseURL = new BinanceProxyBaseURL(origin)
	}

	get action() {
		return new URL('action', this.baseURL)
	}
}
