import {
	PublicApiDataProviderOperation as Operation,
	PublicApiInput as Input
} from "@workspace/api"
import { DocumentProvider, Strategy, StrategyFlow } from "@workspace/models"

import { READ } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export class PublicDataProvider {
	constructor(documentProvider: DocumentProvider) {

	}
	readStrategy(arg: Input["ReadStrategy"]): Promise<Strategy | null> {
		return READ<Operation["ReadStrategy"]>(pathname.strategy(arg))
	}
	readStrategyFlow(
		arg: Input["ReadStrategyFlow"]
	): Promise<StrategyFlow | null> {
		return READ<Operation["ReadStrategyFlow"]>(pathname.strategyFlow(arg))
	}
}
