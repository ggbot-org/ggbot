import { ApiService, DocumentProviderLevel1, isPublicActionInput as isInput, PublicActionType } from "@workspace/api"
import { PublicDatabase } from "@workspace/database"
import { BadRequestError } from "@workspace/http"

export class Service implements ApiService<PublicActionType> {
	dataProvider: PublicDatabase

	constructor(documentProvider: DocumentProviderLevel1) {
		this.dataProvider = new PublicDatabase(documentProvider)
	}

	ReadStrategy(arg: unknown) {
		if (!isInput.ReadStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.ReadStrategy(arg)
	}

	ReadStrategyFlow(arg: unknown) {
		if (!isInput.ReadStrategyFlow(arg)) throw new BadRequestError()
		return this.dataProvider.ReadStrategyFlow(arg)
	}
}
