export class BinanceRequestHeaders extends Headers {
	set apiKey(value: string) {
		this.append('X-MBX-APIKEY', value)
	}
}
