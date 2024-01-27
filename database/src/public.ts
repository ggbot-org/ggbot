import {
	PublicAction,
	PublicActionInput as Input,
	PublicActionOutput as Output,
	DocumentProviderLevel1,
} from "@workspace/api"

import { pathname } from "./locators.js"

export class PublicDatabase implements PublicAction{
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
