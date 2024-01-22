import {
	isPublicApiInput as isInput,
	PublicApiDataProvider,
	PublicApiService} from "@workspace/api"
import { BadRequestError } from "@workspace/http"

export class ApiService implements PublicApiService {
	dataProvider: PublicApiDataProvider

	constructor(dataProvider: PublicApiDataProvider) {
		this.dataProvider = dataProvider
	}

	ReadStrategy(arg: unknown) {
		if (!isInput.ReadStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.readStrategy(arg)
	}

	ReadStrategyFlow(arg: unknown) {
		if (!isInput.ReadStrategyFlow(arg)) throw new BadRequestError()
		return this.dataProvider.readStrategyFlow(arg)
	}
}
