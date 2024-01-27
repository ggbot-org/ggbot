import {
	BinanceClientAction,
	BinanceClientActionInput as Input
} from "@workspace/api"
import { BinanceClient } from "@workspace/binance-client"
import { __500__INTERNAL_SERVER_ERROR__ } from "@workspace/http"

export class BinanceService implements BinanceClientAction {
	binance: BinanceClient

	constructor(apiKey: string, apiSecret: string) {
		this.binance = new BinanceClient(apiKey, apiSecret)
	}

	CreateBinanceOrder({
		symbol,
		side,
		type,
		orderOptions
	}: Input["CreateBinanceOrder"]) {
		return this.binance.newOrder(symbol, side, type, orderOptions)
	}

	ReadBinanceAccountApiRestrictions() {
		return this.binance.apiRestrictions()
	}
}
