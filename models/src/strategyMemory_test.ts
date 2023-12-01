import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { isStrategyMemory, StrategyMemory } from "./strategyMemory.js"
import { invalidIdentifierStrings } from "./strings_test.js"

void describe("isStrategyMemory", () => {
	void test("validates StrategyMemory", () => {
		assertEqual<MaybeObject<StrategyMemory>, boolean>(isStrategyMemory, [
			{
				input: {},
				output: true
			},
			{
				input: {
					"label 1": true,
					"label 2": 123,
					label3: "hello world"
				},
				output: true
			},
			...invalidIdentifierStrings.map((key) => ({
				input: { [key]: "value" },
				output: false
			}))
		])
	})
})
