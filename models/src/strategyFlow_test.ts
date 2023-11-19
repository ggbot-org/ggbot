import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import {
	isStrategyFlowView,
	StrategyFlowView,
	welcomeFlow
} from "./strategyFlow.js"

describe("welcomeFlow", () => {
	test("is a StrategyFlowView", () => {
		assertEqual<MaybeObject<StrategyFlowView>, boolean>(
			isStrategyFlowView,
			[
				{
					input: welcomeFlow,
					output: true
				}
			]
		)
	})
})
