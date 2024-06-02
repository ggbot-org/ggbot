import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import {
	isStrategyParameters,
	StrategyParameters
} from "./strategyParameters.js"
import { invalidIdentifierStrings } from "./strings_test.js"

const invalidValues = ["", Infinity, []]

test("isStrategyParameters", () => {
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
			...invalidIdentifierStrings.map((key) => ({
				input: { [key]: "value" },
				output: false
			})),
			...invalidValues.map((invalidValue) => ({
				input: { key: invalidValue },
				output: false
			}))
		]
	)
})
