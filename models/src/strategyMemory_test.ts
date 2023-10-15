import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { isStrategyMemory, StrategyMemory } from "./strategyMemory.js"

const keyTooLong = "x".repeat(999)
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
