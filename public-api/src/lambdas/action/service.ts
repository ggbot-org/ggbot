import { PublicApiDataProvider, PublicApiService } from "@workspace/api"
import { BadRequestError } from "@workspace/http"
import { isReadStrategyInput, isStrategyKey } from "@workspace/models"

export class ApiService implements PublicApiService {
	dataProvider: PublicApiDataProvider

	constructor(dataProvider: PublicApiDataProvider) {
		this.dataProvider = dataProvider
	}

	ReadStrategy(arg: unknown) {
		if (!isReadStrategyInput(arg)) throw new BadRequestError()
		return this.dataProvider.readStrategy(arg)
	}

	ReadStrategyFlow(arg: unknown) {
		if (!isStrategyKey(arg)) throw new BadRequestError()
		return this.dataProvider.readStrategyFlow(arg)
	}
}
