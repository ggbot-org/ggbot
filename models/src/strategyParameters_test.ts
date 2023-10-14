import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import {
	isStrategyParameters,
	StrategyParameters
} from "./strategyParameters.js"

const keyTooLong = "x".repeat(99)
const invalidKeys = ["", keyTooLong]
const invalidValues = ["", Infinity, []]

describe("isStrategyParameters", () => {
	test("validates StrategyParams", () => {
		assertEqual<MaybeObject<StrategyParameters>, boolean>(
			isStrategyParameters,
			[
				{
					input: {},
					output: true
				},
				{
					input: {
						"param 1": true,
						"param 2": 123,
						param3: "hello world"
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
			]
		)
	})
})
