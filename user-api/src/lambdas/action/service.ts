import { UserApiDataProvider, UserApiService } from "@workspace/api"
import { BadRequestError } from "@workspace/http"
import { isAccountKey, isCopyStrategyInput, isCreateBinanceApiConfigInput, isCreateStrategyInput, isReadStrategyInput, isStrategyKey } from "@workspace/models"

export class ApiService implements UserApiService {
	dataProvider: UserApiDataProvider

	constructor(dataProvider: UserApiDataProvider) {
		this.dataProvider = dataProvider
	}

	CopyStrategy(arg: unknown) {
		if (!isCopyStrategyInput(arg)) throw new BadRequestError()
		return this.dataProvider.copyStrategy(arg)
	}

	CreateBinanceApiConfig(arg:unknown) {
		if (!isCreateBinanceApiConfigInput(arg)) throw new BadRequestError()
		return this.dataProvider.createBinanceApiConfig(arg)
	}

	CreateStrategy(arg:unknown) {
		if (!isCreateStrategyInput(arg)) throw new BadRequestError()
		return this.dataProvider.createStrategy(arg)
	}

	DeleteAccount(arg:unknown) {
		if (!isAccountKey(arg)) throw new BadRequestError()
		return this.dataProvider.deleteAccount(arg)
	}
}

