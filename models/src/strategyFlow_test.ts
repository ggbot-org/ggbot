import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { nullAccountStrategyKey } from "./accountStrategy.js"
import {
	isWriteStrategyFlowInput,
	welcomeFlow,
	WriteStrategyFlowInput
} from "./strategyFlow.js"

void test("isWriteStrategyFlowInput", () => {
	assertEqual<Partial<MaybeObject<WriteStrategyFlowInput>>, boolean>(
		isWriteStrategyFlowInput,
		[
			{
				input: { ...nullAccountStrategyKey, view: welcomeFlow },
				output: true
			}
		]
	)
})
