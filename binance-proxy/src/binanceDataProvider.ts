import {
	BinanceProxyApiDataProvider,
	CreateBinanceOrderInput
} from "@workspace/api"
import {
	BinanceAccountInformation,
	BinanceApiKeyPermission,
	BinanceOrderRespFULL
} from "@workspace/binance"
import { BinanceClient } from "@workspace/binance-client"

export class BinanceDataProvider implements BinanceProxyApiDataProvider {
	binance: BinanceClient

	constructor(apiKey: string, apiSecret: string) {
		this.binance = new BinanceClient(apiKey, apiSecret)
	}

	createBinanceOrder({
		symbol,
		side,
		type,
		orderOptions
	}: CreateBinanceOrderInput): Promise<BinanceOrderRespFULL> {
		return this.binance.newOrder(symbol, side, type, orderOptions)
	}

	createBinanceOrderTest({
		symbol,
		side,
		type,
		orderOptions
	}: CreateBinanceOrderInput): Promise<BinanceOrderRespFULL> {
		return this.binance.newOrderTest(symbol, side, type, orderOptions)
	}

	readBinanceAccount(): Promise<BinanceAccountInformation> {
		return this.binance.account()
	}

	readBinanceAccountApiRestrictions(): Promise<BinanceApiKeyPermission> {
		return this.binance.apiRestrictions()
	}
}
