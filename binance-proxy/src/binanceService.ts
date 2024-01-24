import {
	BinanceProxyApiOutput as Output,
	BinanceProxyApiService,
	isBinanceProxyApiInput as isInput
} from "@workspace/api"
import { ErrorBinanceHTTP } from "@workspace/binance"
import { BinanceClient } from "@workspace/binance-client"
import {
	__500__INTERNAL_SERVER_ERROR__,
	BadRequestError
} from "@workspace/http"

export class BinanceService implements BinanceProxyApiService {
	binance: BinanceClient

	constructor(apiKey: string, apiSecret: string) {
		this.binance = new BinanceClient(apiKey, apiSecret)
	}

	async CreateBinanceOrder(
		arg: unknown
	): Promise<Output["CreateBinanceOrder"]> {
		if (!isInput.CreateBinanceOrder(arg)) throw new BadRequestError()
		const { symbol, side, type, orderOptions } = arg
		try {
			const data = await this.binance.newOrder(
				symbol,
				side,
				type,
				orderOptions
			)
			return data
		} catch (error) {
			if (error instanceof ErrorBinanceHTTP) {
				const {
					info: { status },
					payload
				} = error
				return { status, error: payload }
			}
			// TODO should handle prepareOrder errors or delegate those errors to Binance?
			throw error
		}
	}

	ReadBinanceAccountApiRestrictions() {
		return this.binance.apiRestrictions()
	}
}
