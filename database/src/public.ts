import {
	PublicApiInput as Input,
	PublicApiOutput as Output
} from "@workspace/api"
import { DocumentProvider } from "@workspace/models"

import { pathname } from "./locators.js"

export class PublicDataProvider {
	documentProvider: DocumentProvider

	constructor(documentProvider: DocumentProvider) {
		this.documentProvider = documentProvider
	}

	async readStrategy(
		arg: Input["ReadStrategy"]
	): Promise<Output["ReadStrategy"]> {
		const data = await this.documentProvider.getItem(pathname.strategy(arg))
		return data as Output["ReadStrategy"]
	}

	async readStrategyFlow(
		arg: Input["ReadStrategyFlow"]
	): Promise<Output["ReadStrategyFlow"]> {
		const data = await this.documentProvider.getItem(
			pathname.strategyFlow(arg)
		)
		return data as Output["ReadStrategyFlow"]
	}
}
