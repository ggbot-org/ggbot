import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { isStrategyFlowView, StrategyFlow, welcomeFlow } from "./strategyFlow.js"
import { createdNow } from "./time.js"

test("isStrategyFlowView", () => {
	assertEqual<Partial<MaybeObject<StrategyFlow>>, boolean>(
		isStrategyFlowView,
		[
			{
				input: { whenUpdated: createdNow(), view: welcomeFlow },
				output: true
			}
		]
	)
})
