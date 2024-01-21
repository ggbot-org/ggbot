import {
	BinanceProxyApiDataProvider,
	BinanceProxyApiService,
	isCreateBinanceOrderInput
} from "@workspace/api"
import { BadRequestError } from "@workspace/http"

export class BinanceService implements BinanceProxyApiService {
	dataProvider: BinanceProxyApiDataProvider

	constructor(dataProvider: BinanceProxyApiDataProvider) {
		this.dataProvider = dataProvider
	}

	CreateBinanceOrder(arg: unknown) {
		if (!isCreateBinanceOrderInput(arg)) throw new BadRequestError()
		return this.dataProvider.createBinanceOrder(arg)
	}

	ReadBinanceAccountApiRestrictions() {
		return this.dataProvider.readBinanceAccountApiRestrictions()
	}
}
