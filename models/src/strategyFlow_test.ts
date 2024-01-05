import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { accountStrategyKey } from "./accountStrategy_test.js"
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
				input: { ...accountStrategyKey, view: welcomeFlow },
				output: true
			}
		]
	)
})
