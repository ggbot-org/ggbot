import {
	isPublicApiInput as isInput,
	PublicApiActionType
} from "@workspace/api"
import { PublicDatabase } from "@workspace/database"
import { BadRequestError } from "@workspace/http"
import { ApiService } from "@workspace/models"
import { dataProvider } from "./dataProvider.js"

export class Service implements ApiService<PublicApiActionType> {
	dataProvider: PublicDatabase

	constructor(dataProvider: PublicDatabase) {
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

export const service = new Service(dataProvider)
