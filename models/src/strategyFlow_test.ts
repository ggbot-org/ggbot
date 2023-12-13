import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { accountStrategyKey } from "./accountStrategy_test.js"
import {
	isWriteStrategyFlowInput,
	welcomeFlow,
	WriteStrategyFlowInput
} from "./strategyFlow.js"

void describe("isWriteStrategyFlowInput", () => {
	void test("validates WriteStrategyFlowInput", () => {
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
})
