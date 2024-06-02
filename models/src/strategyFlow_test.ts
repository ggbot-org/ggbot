import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import {
	isFlowViewSerializableGraph,
	StrategyFlow,
	welcomeFlow
} from "./strategyFlow.js"
import { createdNow } from "./time.js"

test("isFlowViewSerializableGraph", () => {
	assertEqual<Partial<MaybeObject<StrategyFlow>>, boolean>(
		isFlowViewSerializableGraph,
		[
			{
				input: { whenUpdated: createdNow(), view: welcomeFlow },
				output: true
			}
		]
	)
})
