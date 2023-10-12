import { describe, test } from "node:test"

import { assertEqual } from "./assertions.js"
import { isStrategyInput, StrategyInput } from "./strategyInput.js"

describe("isStrategyInput", () => {
	test("validates StrategyInput", () => {
		assertEqual<StrategyInput, boolean>(isStrategyInput, [
			{
				input: {
					"input 1": true,
					"input 2": 123,
					input3: "hello world"
				},
				output: true
			}
		])
	})
})
