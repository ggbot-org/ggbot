import { ApiService, BinanceClientActionType, isBinanceClientActionInput as isInput } from "@workspace/api"
import { BinanceClient } from "@workspace/binance-client"
import { BadRequestError } from "@workspace/http"

export class BinanceService implements ApiService<BinanceClientActionType> {
	binance: BinanceClient

	constructor(apiKey: string, apiSecret: string) {
		this.binance = new BinanceClient(apiKey, apiSecret)
	}

	CreateBinanceOrder(arg: unknown) {
		if (!isInput.CreateBinanceOrder(arg)) throw new BadRequestError()
		const { symbol, side, type, orderOptions } = arg
		return this.binance.newOrder(symbol, side, type, orderOptions)
	}

	ReadBinanceAccountApiRestrictions() {
		return this.binance.apiRestrictions()
	}
}
