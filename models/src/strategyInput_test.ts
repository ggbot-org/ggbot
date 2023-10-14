import { describe, test } from "node:test"

import { MaybeObject } from "minimal-type-guard-helpers"

import { assertEqual } from "./assertions.js"
import { isStrategyInput, StrategyInput } from "./strategyInput.js"

const keyTooLong = "x".repeat(99)
const invalidKeys = ["", keyTooLong]
const invalidValues = ["", Infinity, []]

describe("isStrategyInput", () => {
	test("validates StrategyInput", () => {
		assertEqual<MaybeObject<StrategyInput>, boolean>(isStrategyInput, [
			{
				input: {},
				output: true
			},
			{
				input: {
					"input 1": true,
					"input 2": 123,
					input3: "hello world"
				},
				output: true
			},
			...invalidKeys.map((invalidKey) => ({
				input: { [invalidKey]: "value" },
				output: false
			})),
			...invalidValues.map((invalidValue) => ({
				input: { key: invalidValue },
				output: false
			}))
		])
	})
})
