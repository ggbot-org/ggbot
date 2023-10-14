import { describe, test } from "node:test"

import { MaybeObject } from "minimal-type-guard-helpers"

import { assertEqual } from "./assertions.js"
import { isStrategyMemory, StrategyMemory } from "./strategyMemory.js"

const keyTooLong = "x".repeat(99)
const invalidKeys = ["", keyTooLong]

describe("isStrategyMemory", () => {
	test("validates StrategyMemory", () => {
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
			...invalidKeys.map((invalidKey) => ({
				input: { [invalidKey]: "value" },
				output: false
			}))
		])
	})
})
