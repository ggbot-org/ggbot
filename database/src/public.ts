import {
	DocumentProviderLevel1,
	PublicActionInput as Input,
	PublicActionOutput as Output,
	PublicDataprovider
} from "@workspace/api"

import { pathname } from "./locators.js"

export class PublicDatabase implements PublicDataprovider{
	documentProvider: DocumentProviderLevel1

	constructor(documentProvider: PublicDatabase["documentProvider"]) {
		this.documentProvider = documentProvider
	}

	ReadStrategy( arg: Input["ReadStrategy"]) {
		return this.documentProvider.getItem<Output['ReadStrategy']>(pathname.strategy(arg))
	}

	ReadStrategyFlow( arg: Input["ReadStrategyFlow"]) {
		return this.documentProvider.getItem<Output["ReadStrategyFlow"] >(
			pathname.strategyFlow(arg)
		)
	}
}
