import {
	BinanceProxyApiInput as Input,
	BinanceProxyApiDataProvider,
} from "@workspace/api"
import {
	BinanceAccountInformation,
	BinanceApiKeyPermission,
	BinanceOrderRespFULL
} from "@workspace/binance"
import {BinanceClient} from "@workspace/binance-client"
import {NotImplementedError} from "@workspace/http"

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
	}: Input['CreateBinanceOrder']): Promise<BinanceOrderRespFULL> {
		return this.binance.newOrder(symbol, side, type, orderOptions)
	}

	readBinanceAccount(): Promise<BinanceAccountInformation> {
		// TODO return this.binance.account()
		throw new NotImplementedError()
	}

	readBinanceAccountApiRestrictions(): Promise<BinanceApiKeyPermission> {
		return this.binance.apiRestrictions()
	}
}
