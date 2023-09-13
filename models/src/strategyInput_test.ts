import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { isStrategyInput } from "./strategyInput.js"

describe("isStrategyInput", () => {
	it("validates StrategyInput", () => {
		[
			{
				input: {
					"input 1": true,
					"input 2": 123,
					input3: "hello world"
				},
				output: true
			}
		].forEach(({ input, output }) => {
			assert.equal(
				isStrategyInput(input),
				output,
				`isStrategyInput(${JSON.stringify(input)}) !== ${output}`
			)
		})
	})
})
