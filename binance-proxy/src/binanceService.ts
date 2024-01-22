import {
	BinanceProxyApiDataProvider,
	BinanceProxyApiService,
	isBinanceProxyApiInput as isInput
} from "@workspace/api"
import { BadRequestError } from "@workspace/http"

export class BinanceService implements BinanceProxyApiService {
	dataProvider: BinanceProxyApiDataProvider

	constructor(dataProvider: BinanceProxyApiDataProvider) {
		this.dataProvider = dataProvider
	}

	CreateBinanceOrder(arg: unknown) {
		if (!isInput.CreateBinanceOrder(arg)) throw new BadRequestError()
		return this.dataProvider.createBinanceOrder(arg)
	}

	ReadBinanceAccountApiRestrictions() {
		return this.dataProvider.readBinanceAccountApiRestrictions()
	}
}
