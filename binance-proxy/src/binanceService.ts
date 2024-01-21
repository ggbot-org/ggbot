import {
	BinanceApiDataProvider,
	BinanceApiService,
	isCreateBinanceOrderInput
} from "@workspace/api"
import { BadRequestError } from "@workspace/http"

export class BinanceService implements BinanceApiService {
	dataProvider: BinanceApiDataProvider

	constructor(dataProvider: BinanceApiDataProvider) {
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
